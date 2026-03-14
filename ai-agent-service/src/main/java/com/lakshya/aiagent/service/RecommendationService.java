package com.lakshya.aiagent.service;

import com.lakshya.aiagent.kafka.RecommendationProducer;
import com.lakshya.aiagent.model.RecommendationEvent;
import com.lakshya.aiagent.model.StockEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final StockAnalysisService stockAnalysisService;
    private final RecommendationProducer recommendationProducer;

    public void analyzeStock(StockEvent stock){

        try{

            String aiResponse = stockAnalysisService.analyze(stock);

            RecommendationEvent event = new RecommendationEvent(
                    stock.getSymbol(),
                    "AI_RESPONSE",
                    "UNKNOWN",
                    aiResponse
            );

            recommendationProducer.sendRecommendation(event);

            System.out.println("Sent recommendation: " + event);

        }catch(Exception e){
            e.printStackTrace();
        }
    }
}