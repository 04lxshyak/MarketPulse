package com.lakshya.aiagent.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.aiagent.kafka.RecommendationProducer;
import com.lakshya.aiagent.model.AIRecommendation;
import com.lakshya.aiagent.model.RecommendationEvent;
import com.lakshya.aiagent.model.StockEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final StockAnalysisService stockAnalysisService;
    private final RecommendationProducer recommendationProducer;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void analyzeStock(StockEvent stock){

        try{

            String aiResponse = stockAnalysisService.analyze(stock);

            AIRecommendation recommendation =
                    objectMapper.readValue(aiResponse, AIRecommendation.class);

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