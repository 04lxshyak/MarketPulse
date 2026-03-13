package com.lakshya.aiagent.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.aiagent.model.StockEvent;
import com.lakshya.aiagent.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StockConsumer {

    private final RecommendationService recommendationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "stock-price-updates", groupId = "ai-agent-group")
    public void consume(String message) {

        try {

            StockEvent event = objectMapper.readValue(message, StockEvent.class);

            System.out.println("Received stock event: " + event);

            recommendationService.analyzeStock(event);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}