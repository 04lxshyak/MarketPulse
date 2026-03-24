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

            // Robust JSON extraction using Regex
            java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("\\{.*\\}", java.util.regex.Pattern.DOTALL).matcher(aiText);
            
            String jsonText = aiText;
            if (matcher.find()) {
                jsonText = matcher.group(0);
            }

            System.out.println("AI PARSED TEXT: " + jsonText);

            return mapper.readValue(jsonText, StockRecommendation.class);

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