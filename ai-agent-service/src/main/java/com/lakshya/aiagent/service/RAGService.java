package com.lakshya.aiagent.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.aiagent.model.StockEmbedding;
import com.lakshya.aiagent.model.StockRecommendation;
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
    private final ObjectMapper mapper = new ObjectMapper();

    public String retrieveSimilarContext(String symbol, String contextPrefix) {
        try {
            float[] vector = geminiService.generateEmbedding(contextPrefix);
            if (vector == null || vector.length == 0) return "";

            // Convert array to string format `[0.1, 0.2, ...]` to inject into cast(:vector as vector) safely
            String vectorStr = Arrays.toString(vector);

            List<StockEmbedding> similars = embeddingRepository.findSimilarBySymbol(symbol, vectorStr, 3);
            if (similars.isEmpty()) return "";

            return similars.stream().map(se -> {
                try {
                    StockRecommendation sr = mapper.readValue(se.getMetadata(), StockRecommendation.class);
                    return String.format(
                            "Past case - Symbol: %s, Recommended: %s, Sentiment: %s, Risk: %s, Reason: %s",
                            sr.getSymbol(), sr.getRecommendation(), sr.getSentiment(), sr.getRiskLevel(), sr.getReason()
                    );
                } catch (Exception e) {
                    return "Past case parsing failure.";
                }
            }).collect(Collectors.joining("\n"));

        } catch (Exception e) {
            System.err.println("RAG retrieval failed: " + e.getMessage());
            return "";
        }
    }

    public void storeEmbedding(StockRecommendation sr) {
        try {
            String textToEmbed = String.format("Analyze %s: Action %s because %s", sr.getSymbol(), sr.getRecommendation(), sr.getReason());
            float[] vector = geminiService.generateEmbedding(textToEmbed);

            if (vector != null && vector.length > 0) {
                StockEmbedding se = new StockEmbedding();
                se.setSymbol(sr.getSymbol());
                se.setEmbedding(vector);
                se.setMetadata(mapper.writeValueAsString(sr));
                se.setTimestamp(System.currentTimeMillis());
                embeddingRepository.save(se);
                System.out.println("✅ Stored RAG embedding for " + sr.getSymbol());
            }

        } catch (Exception e) {
            System.err.println("RAG storage failed: " + e.getMessage());
        }
    }
}
