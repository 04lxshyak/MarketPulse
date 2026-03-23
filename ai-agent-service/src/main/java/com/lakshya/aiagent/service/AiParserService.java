package com.lakshya.aiagent.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.aiagent.model.StockRecommendation;
import org.springframework.stereotype.Service;

@Service
public class AiParserService {

    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Parses the AI-extracted text (already unwrapped from the Gemini envelope by GeminiService)
     * into a StockRecommendation. Handles markdown code fences like ```json ... ```.
     */
    public StockRecommendation parse(String aiText) {
        try {
            System.out.println("AI RAW TEXT: " + aiText);

            // Strip markdown code fences if present
            String text = aiText.trim();
            if (text.startsWith("```json")) {
                text = text.substring(7);
            } else if (text.startsWith("```")) {
                text = text.substring(3);
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length() - 3);
            }
            text = text.trim();

            System.out.println("AI PARSED TEXT: " + text);

            return mapper.readValue(text, StockRecommendation.class);

        } catch (Exception e) {
            System.out.println("❌ Error while parsing AI text: " + e.getMessage());
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