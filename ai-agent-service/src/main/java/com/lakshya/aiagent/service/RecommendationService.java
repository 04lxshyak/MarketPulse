package com.lakshya.aiagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.aiagent.kafka.RecommendationProducer;
import com.lakshya.aiagent.model.AIRecommendation;
import com.lakshya.aiagent.model.RecommendationEvent;
import com.lakshya.aiagent.model.StockEvent;
import com.lakshya.aiagent.model.StockRecommendation;
import com.lakshya.aiagent.repository.StockRecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final StockAnalysisService stockAnalysisService;
    private final RecommendationProducer recommendationProducer;
    private final StockRecommendationRepository repository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void analyzeStock(StockEvent stock){

        try{


            String aiResponse = stockAnalysisService.analyze(stock);

            System.out.println("RAW AI RESPONSE: " + aiResponse);


            JsonNode root = objectMapper.readTree(aiResponse);

            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();


            AIRecommendation recommendation =
                    objectMapper.readValue(text, AIRecommendation.class);


            StockRecommendation entity = new StockRecommendation();
            entity.setSymbol(recommendation.getSymbol());
            entity.setRecommendation(recommendation.getRecommendation());
            entity.setSentiment(recommendation.getSentiment());
            entity.setRiskLevel(recommendation.getRisk_level());
            entity.setConfidence(recommendation.getConfidence());
            entity.setReason(recommendation.getReason());
            entity.setTimestamp(System.currentTimeMillis());

            repository.save(entity);

            System.out.println("Saved to PostgreSQL ✅");

            // 🔥 5. Publish to Kafka
            RecommendationEvent event = new RecommendationEvent(
                    recommendation.getSymbol(),
                    recommendation.getRecommendation(),
                    recommendation.getSentiment(),
                    recommendation.getReason()
            );

            recommendationProducer.sendRecommendation(event);

            System.out.println("Sent recommendation: " + event);

        }catch(Exception e){
            e.printStackTrace();
        }
    }
}