package com.lakshya.aiagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public String analyzeStock(String symbol,
                               double price,
                               double high,
                               double low,
                               long volume,
                               String news,
                               String historicalContext) {

        try {
            String safeNews = news != null ? news : "No relevant news found.";
            String safeHistorical = historicalContext != null && !historicalContext.isBlank()
                    ? historicalContext
                    : "No relevant historical patterns found.";

            String prompt = String.format(
                "You are a professional stock market analyst AI.\n\n" +
                "Analyze the following stock data, latest market news, and historical context.\n\n" +
                "Return ONLY valid JSON:\n" +
                "{\n" +
                "  \"symbol\": \"%s\",\n" +
                "  \"recommendation\": \"BUY | SELL | HOLD\",\n" +
                "  \"sentiment\": \"POSITIVE | NEGATIVE | NEUTRAL\",\n" +
                "  \"risk_level\": \"LOW | MEDIUM | HIGH\",\n" +
                "  \"confidence\": <integer 0-100>,\n" +
                "  \"reason\": \"<short explanation>\"\n" +
                "}\n\n" +
                "STOCK:\nSymbol: %s\nPrice: %.2f\nHigh: %.2f\nLow: %.2f\nVolume: %d\n\n" +
                "NEWS:\n%s\n\n" +
                "HISTORICAL CONTEXT:\n%s",
                symbol, symbol, price, high, low, volume, safeNews, safeHistorical
            );

            // Robust JSON construction using Jackson
            com.fasterxml.jackson.databind.node.ObjectNode root = mapper.createObjectNode();
            com.fasterxml.jackson.databind.node.ArrayNode contents = root.putArray("contents");
            com.fasterxml.jackson.databind.node.ObjectNode part = mapper.createObjectNode();
            com.fasterxml.jackson.databind.node.ArrayNode parts = part.putArray("parts");
            com.fasterxml.jackson.databind.node.ObjectNode textNode = mapper.createObjectNode();
            textNode.put("text", prompt);
            parts.add(textNode);
            contents.add(part);

            String jsonPayload = mapper.writeValueAsString(root);

            RequestBody body = RequestBody.create(
                    jsonPayload,
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + apiKey)
                    .post(body)
                    .build();

            Response response = client.newCall(request).execute();

            if (response.body() != null) {
                String raw = response.body().string();
                System.out.println("GEMINI RAW RESPONSE: " + raw);

                JsonNode respRoot = mapper.readTree(raw);
                JsonNode candidates = respRoot.path("candidates");

                if (!candidates.isArray() || candidates.size() == 0) {
                    System.out.println("❌ No candidates found in Gemini response");
                    return "AI_ERROR";
                }

                JsonNode respParts = candidates.get(0).path("content").path("parts");

                if (!respParts.isArray() || respParts.size() == 0) {
                    System.out.println("❌ No parts found in Gemini response");
                    return "AI_ERROR";
                }

                return respParts.get(0).path("text").asText();
            }

        } catch (Exception e) {
            System.out.println("❌ Error in GeminiService analyzeStock: " + e.getMessage());
        }

        return "AI_ERROR";
    }

    public float[] generateEmbedding(String text) {
        try {
            com.fasterxml.jackson.databind.node.ObjectNode root = mapper.createObjectNode();
            com.fasterxml.jackson.databind.node.ObjectNode content = mapper.createObjectNode();
            com.fasterxml.jackson.databind.node.ArrayNode parts = content.putArray("parts");
            com.fasterxml.jackson.databind.node.ObjectNode textNode = mapper.createObjectNode();
            textNode.put("text", text);
            parts.add(textNode);
            root.set("content", content);

            String jsonPayload = mapper.writeValueAsString(root);

            RequestBody body = RequestBody.create(
                    jsonPayload,
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=" + apiKey)
                    .post(body)
                    .build();

            Response response = client.newCall(request).execute();

            if (response.body() != null) {
                String raw = response.body().string();
                JsonNode respRoot = mapper.readTree(raw);
                JsonNode valuesNode = respRoot.path("embedding").path("values");

                if (valuesNode.isArray()) {
                    float[] embedding = new float[valuesNode.size()];
                    for (int i = 0; i < valuesNode.size(); i++) {
                        embedding[i] = (float) valuesNode.get(i).asDouble();
                    }
                    return embedding;
                }
            }
        } catch (Exception e) {
            System.out.println("❌ Error in GeminiService generateEmbedding: " + e.getMessage());
        }
        return new float[0];
    }
}