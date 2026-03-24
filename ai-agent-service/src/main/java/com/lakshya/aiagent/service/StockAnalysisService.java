package com.lakshya.aiagent.service;

import com.lakshya.aiagent.model.StockEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockAnalysisService {

    private final NewsService newsService;
    private final GeminiService geminiService;

    public String analyze(StockEvent stock, String historicalContext) {

        try {

            String news = newsService.getNews(stock.getSymbol());

            System.out.println("Fetched news for " + stock.getSymbol());

            return geminiService.analyzeStock(
                    stock.getSymbol(),
                    stock.getPrice(),
                    stock.getHigh(),
                    stock.getLow(),
                    stock.getVolume(),
                    news,
                    historicalContext
            );

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "AI_ANALYSIS_FAILED";
    }
}