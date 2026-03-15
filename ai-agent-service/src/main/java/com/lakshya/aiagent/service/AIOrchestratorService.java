package com.lakshya.aiagent.service;

import com.lakshya.aiagent.kafka.RecommendationProducer;
import com.lakshya.aiagent.model.RecommendationEvent;
import com.lakshya.aiagent.model.StockEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIOrchestratorService {

    private final StockAnalysisService stockAnalysisService;
    private final RecommendationProducer recommendationProducer;

    public void processStockEvent(StockEvent stockEvent) {

        try {

            System.out.println("Starting AI analysis for " + stockEvent.getSymbol());

            String aiResponse = stockAnalysisService.analyze(stockEvent);

            RecommendationEvent recommendation = new RecommendationEvent(
                    stockEvent.getSymbol(),
                    "AI_ANALYSIS",
                    "UNKNOWN",
                    aiResponse
            );

            recommendationProducer.sendRecommendation(recommendation);

            System.out.println("Recommendation published for " + stockEvent.getSymbol());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}