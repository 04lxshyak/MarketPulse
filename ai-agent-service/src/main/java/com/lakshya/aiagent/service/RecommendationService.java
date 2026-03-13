package com.lakshya.aiagent.service;

import com.lakshya.aiagent.kafka.RecommendationProducer;
import com.lakshya.aiagent.model.RecommendationEvent;
import com.lakshya.aiagent.model.StockEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final GeminiService geminiService;
    private final RecommendationProducer recommendationProducer;

    public void analyzeStock(StockEvent stock){

        try{

            String prompt = """
            Analyze this stock and give investment recommendation.

            Symbol: %s
            Price: %f
            Day High: %f
            Day Low: %f
            Volume: %d

            Return recommendation BUY SELL or HOLD with short reason.
            """.formatted(
                    stock.getSymbol(),
                    stock.getPrice(),
                    stock.getHigh(),
                    stock.getLow(),
                    stock.getVolume()
            );

            String aiResponse = geminiService.analyzeStock(prompt);

            RecommendationEvent event = new RecommendationEvent(
                    stock.getSymbol(),
                    "AI_RESPONSE",
                    "UNKNOWN",
                    aiResponse
            );

            recommendationProducer.sendRecommendation(event);

        }
        catch (Exception e){
            e.printStackTrace();
        }

    }
}