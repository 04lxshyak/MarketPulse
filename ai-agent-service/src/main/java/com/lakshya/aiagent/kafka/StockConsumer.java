package com.lakshya.aiagent.kafka;

import com.lakshya.aiagent.model.StockEvent;
import com.lakshya.aiagent.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StockConsumer {

    private static final Logger log = LoggerFactory.getLogger(StockConsumer.class);

    private final RecommendationService recommendationService;

    @KafkaListener(topics = "stock-price-updates", groupId = "ai-agent-group")
    public void consume(StockEvent event) {
        log.info("📥 Received stock event: symbol={}, price={}", event.getSymbol(), event.getPrice());
        recommendationService.analyzeStock(event);
    }
}