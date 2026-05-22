package com.lakshya.aiagent.service;

import com.lakshya.aiagent.model.StockEvent;
import com.lakshya.aiagent.model.TechnicalSnapshot;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockAnalysisService {

    private final NewsService newsService;
    private final GeminiService geminiService;

    public String analyze(StockEvent stock, TechnicalSnapshot technicalSnapshot, String historicalContext) {

        try {

            String news = newsService.getNews(stock.getSymbol());

            System.out.println("Fetched news for " + stock.getSymbol());
            String enrichedHistoricalContext = String.format(
                    "CURRENT TECHNICAL SETUP:\n%s\n\nSIMILAR HISTORICAL SETUPS:\n%s",
                    technicalSnapshot.getSummary(),
                    historicalContext == null || historicalContext.isBlank()
                            ? "No similar historical setups available."
                            : historicalContext
            );

            return geminiService.analyzeStock(
                    stock.getSymbol(),
                    stock.getPrice(),
                    stock.getHigh(),
                    stock.getLow(),
                    stock.getVolume(),
                    news,
                    enrichedHistoricalContext
            );

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "AI_ANALYSIS_FAILED";
    }
}
