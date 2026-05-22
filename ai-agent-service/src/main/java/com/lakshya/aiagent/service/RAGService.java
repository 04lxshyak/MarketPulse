package com.lakshya.aiagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.lakshya.aiagent.model.StockEmbedding;
import com.lakshya.aiagent.model.StockRecommendation;
import com.lakshya.aiagent.model.TechnicalSnapshot;
import com.lakshya.aiagent.repository.StockEmbeddingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RAGService {

    private final StockEmbeddingRepository embeddingRepository;
    private final GeminiService geminiService;
    private final TechnicalFeatureService technicalFeatureService;
    private final ObjectMapper mapper = new ObjectMapper();

    public String retrieveSimilarContext(String symbol, String contextPrefix) {
        try {
            float[] vector = geminiService.generateEmbedding(contextPrefix);
            if (vector == null || vector.length == 0) return "";

            String vectorStr = Arrays.toString(vector);

            List<StockEmbedding> similars = embeddingRepository.findSimilarBySymbol(symbol, vectorStr, 3);
            if (similars.isEmpty()) return "";

            return similars.stream().map(this::formatHistoricalCase).collect(Collectors.joining("\n"));

        } catch (Exception e) {
            System.err.println("RAG retrieval failed: " + e.getMessage());
            return "";
        }
    }

    public void storeEmbedding(StockRecommendation sr) {
        storeEmbedding(sr, null);
    }

    public void storeEmbedding(StockRecommendation sr, TechnicalSnapshot snapshot) {
        try {
            String marketContext = snapshot != null ? technicalFeatureService.toEmbeddingText(snapshot) : "";
            String textToEmbed = String.format(
                    "%s Recommendation: %s. Sentiment: %s. Risk: %s. Confidence: %d. Reason: %s",
                    marketContext,
                    sr.getRecommendation(),
                    sr.getSentiment(),
                    sr.getRiskLevel(),
                    sr.getConfidence(),
                    sr.getReason()
            ).trim();

            float[] vector = geminiService.generateEmbedding(textToEmbed);

            if (vector != null && vector.length > 0) {
                StockEmbedding se = new StockEmbedding();
                se.setSymbol(sr.getSymbol());
                se.setEmbedding(vector);
                se.setMetadata(buildMetadata(sr, snapshot));
                se.setTimestamp(System.currentTimeMillis());
                embeddingRepository.save(se);
                System.out.println("Stored RAG embedding for " + sr.getSymbol());
            }

        } catch (Exception e) {
            System.err.println("RAG storage failed: " + e.getMessage());
        }
    }

    private String formatHistoricalCase(StockEmbedding embedding) {
        try {
            JsonNode metadata = mapper.readTree(embedding.getMetadata());
            JsonNode recommendationNode = metadata.has("recommendation") && metadata.get("recommendation").isObject()
                    ? metadata.get("recommendation")
                    : metadata;

            StockRecommendation sr = mapper.treeToValue(recommendationNode, StockRecommendation.class);
            String marketContext = "";

            if (metadata.has("technicalSnapshot")) {
                TechnicalSnapshot snapshot = mapper.treeToValue(metadata.get("technicalSnapshot"), TechnicalSnapshot.class);
                marketContext = String.format(
                        " Market setup: price %.2f vs previous close %.2f, day change %.2f%%, recent window change %.2f%% across %d samples, intraday range %.2f%%, close position %.2f%%, trend %s, volatility %s, volume level %s.",
                        snapshot.getPrice(),
                        snapshot.getPreviousClose(),
                        snapshot.getPriceChangePercent(),
                        snapshot.getWindowChangePercent(),
                        snapshot.getObservedSamples(),
                        snapshot.getIntradayRangePercent(),
                        snapshot.getClosePositionPercent(),
                        snapshot.getTrendDirection(),
                        snapshot.getVolatilityLevel(),
                        snapshot.getVolumeLevel()
                );
            }

            return String.format(
                    "Past case - Symbol: %s, Recommended: %s, Sentiment: %s, Risk: %s.%s Reason: %s",
                    sr.getSymbol(),
                    sr.getRecommendation(),
                    sr.getSentiment(),
                    sr.getRiskLevel(),
                    marketContext,
                    sr.getReason()
            );
        } catch (Exception e) {
            return "Past case parsing failure.";
        }
    }

    private String buildMetadata(StockRecommendation recommendation, TechnicalSnapshot snapshot) throws Exception {
        ObjectNode root = mapper.createObjectNode();
        root.set("recommendation", mapper.valueToTree(recommendation));
        if (snapshot != null) {
            root.set("technicalSnapshot", mapper.valueToTree(snapshot));
        }
        return mapper.writeValueAsString(root);
    }
}
