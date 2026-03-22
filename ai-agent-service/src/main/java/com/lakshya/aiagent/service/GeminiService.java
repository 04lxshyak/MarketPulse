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
                               String news) {

        try {

            String safeNews = news
                    .replace("\"", "'")
                    .replace("\n", " ")
                    .replace("\r", " ");

            String prompt = """
                You are a professional stock market analyst AI.

                Analyze the following stock data and latest market news.

                Return ONLY valid JSON:

                {
                  "symbol": "%s",
                  "recommendation": "BUY | SELL | HOLD",
                  "sentiment": "POSITIVE | NEGATIVE | NEUTRAL",
                  "risk_level": "LOW | MEDIUM | HIGH",
                  "confidence": 0,
                  "reason": "Short explanation"
                }

                STOCK:
                Symbol: %s
                Price: %.2f
                High: %.2f
                Low: %.2f
                Volume: %d

                NEWS:
                %s
                """.formatted(symbol, symbol, price, high, low, volume, safeNews);

            String json = """
                {
                  "contents": [
                    {
                      "parts": [
                        {"text": "%s"}
                      ]
                    }
                  ]
                }
                """.formatted(prompt.replace("\"", "\\\""));

            RequestBody body = RequestBody.create(
                    json,
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + apiKey)
                    .post(body)
                    .build();

            Response response = client.newCall(request).execute();

            if (response.body() != null) {

                String raw = response.body().string();

                // 🔥 DEBUG (IMPORTANT)
                System.out.println("GEMINI RAW RESPONSE: " + raw);

                JsonNode root = mapper.readTree(raw);

                JsonNode candidates = root.path("candidates");

                // ✅ SAFE CHECK
                if (!candidates.isArray() || candidates.size() == 0) {
                    System.out.println("❌ No candidates found in Gemini response");
                    return "AI_ERROR";
                }

                JsonNode first = candidates.get(0);
                JsonNode parts = first.path("content").path("parts");

                // ✅ SAFE CHECK
                if (!parts.isArray() || parts.size() == 0) {
                    System.out.println("❌ No parts found in Gemini response");
                    return "AI_ERROR";
                }

                String text = parts.get(0).path("text").asText();

                // 🔥 DEBUG
                System.out.println("GEMINI TEXT: " + text);

                return text;
            }

        } catch (Exception e) {
            System.out.println("❌ Error in GeminiService");
            e.printStackTrace();
        }

        return "AI_ERROR";
    }
}