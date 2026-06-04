package com.lakshya.aiagent.service;

import com.lakshya.aiagent.model.StockRecommendation;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AiParserServiceTest {

    private final AiParserService parserService = new AiParserService();

    @Test
    void parsesJsonFromMarkdownFence() {
        String aiText = """
                ```json
                {
                  "symbol": "AAPL",
                  "recommendation": "BUY",
                  "sentiment": "POSITIVE",
                  "risk_level": "MEDIUM",
                  "confidence": 82,
                  "reason": "Strong momentum with healthy volume."
                }
                ```
                """;

        StockRecommendation recommendation = parserService.parse(aiText);

        assertThat(recommendation.getSymbol()).isEqualTo("AAPL");
        assertThat(recommendation.getRecommendation()).isEqualTo("BUY");
        assertThat(recommendation.getSentiment()).isEqualTo("POSITIVE");
        assertThat(recommendation.getRiskLevel()).isEqualTo("MEDIUM");
        assertThat(recommendation.getConfidence()).isEqualTo(82);
    }

    @Test
    void fallsBackWhenResponseIsNotJson() {
        StockRecommendation recommendation = parserService.parse("not-json");

        assertThat(recommendation.getSymbol()).isEqualTo("UNKNOWN");
        assertThat(recommendation.getRecommendation()).isEqualTo("HOLD");
        assertThat(recommendation.getConfidence()).isZero();
    }
}
