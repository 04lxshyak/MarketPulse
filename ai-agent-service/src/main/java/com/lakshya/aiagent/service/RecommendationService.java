package com.lakshya.aiagent.service;

import com.lakshya.aiagent.kafka.RecommendationProducer;
import com.lakshya.aiagent.model.RecommendationEvent;
import com.lakshya.aiagent.model.StockEvent;
import com.lakshya.aiagent.model.StockRecommendation;
import com.lakshya.aiagent.repository.StockRecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final StockAnalysisService stockAnalysisService;
    private final RecommendationProducer recommendationProducer;
    private final StockRecommendationRepository repository;
    private final AiParserService aiParserService;

    public void analyzeStock(StockEvent stock) {
        try {
            log.info("🔍 Analyzing stock: {}", stock.getSymbol());

            String aiResponse = stockAnalysisService.analyze(stock);

            StockRecommendation entity = aiParserService.parse(aiResponse);

            if ("UNKNOWN".equals(entity.getSymbol())) {
                entity.setSymbol(stock.getSymbol());
            }

            entity.setTimestamp(System.currentTimeMillis());

            repository.save(entity);
            log.info("✅ Saved recommendation to DB: symbol={}, action={}", entity.getSymbol(), entity.getRecommendation());

            RecommendationEvent event = new RecommendationEvent(
                    entity.getSymbol(),
                    entity.getRecommendation(),
                    entity.getSentiment(),
                    entity.getReason()
            );

            recommendationProducer.sendRecommendation(event);
            log.info("📤 Published recommendation to Kafka: symbol={}", entity.getSymbol());

        } catch (Exception e) {
            log.error("❌ Failed to process stock event for symbol={}: {}", stock.getSymbol(), e.getMessage(), e);
            throw new RuntimeException("Failed to process stock: " + stock.getSymbol(), e);
        }
    }
}