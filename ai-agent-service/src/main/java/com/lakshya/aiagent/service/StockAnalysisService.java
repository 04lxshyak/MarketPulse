package com.lakshya.aiagent.service;

import com.lakshya.aiagent.model.StockEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockAnalysisService {

    private final GeminiService geminiService;
    private final NewsService newsService;

    public String analyze(StockEvent stockEvent) {

        String news = newsService.getNews(stockEvent.getSymbol());

        return geminiService.analyzeStock(
                stockEvent.getSymbol(),
                stockEvent.getPrice(),
                stockEvent.getHigh(),
                stockEvent.getLow(),
                stockEvent.getVolume(),
                news
        );
    }
}