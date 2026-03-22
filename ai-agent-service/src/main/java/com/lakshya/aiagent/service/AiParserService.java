package com.lakshya.aiagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.aiagent.model.StockRecommendation;
import org.springframework.stereotype.Service;

@Service
public class AiParserService {

    private final ObjectMapper mapper = new ObjectMapper();

    public StockRecommendation parse(String aiResponse) {
        try {

            System.out.println("AI RAW RESPONSE: " + aiResponse);

            JsonNode root = mapper.readTree(aiResponse);

            JsonNode candidates = root.path("candidates");

            // ✅ Step 1: validate candidates
            if (!candidates.isArray() || candidates.size() == 0) {
                System.out.println("❌ No candidates found in AI response");
                return fallback();
            }

            JsonNode first = candidates.get(0);

            JsonNode parts = first.path("content").path("parts");


            if (!parts.isArray() || parts.size() == 0) {
                System.out.println("❌ No parts found in AI response");
                return fallback();
            }

            String text = parts.get(0).path("text").asText();

            System.out.println("AI EXTRACTED TEXT: " + text);


            StockRecommendation recommendation =
                    mapper.readValue(text, StockRecommendation.class);

            return recommendation;

        } catch (Exception e) {
            System.out.println("❌ Error while parsing AI response");
            e.printStackTrace();
            return fallback();
        }
    }


    private StockRecommendation fallback() {
        StockRecommendation sr = new StockRecommendation();
        sr.setSymbol("UNKNOWN");
        sr.setRecommendation("HOLD");
        sr.setSentiment("NEUTRAL");
        sr.setConfidence(0);
        sr.setReason("AI parsing failed");
        sr.setRiskLevel("MEDIUM");
        sr.setTimestamp(System.currentTimeMillis());
        return sr;
    }
}