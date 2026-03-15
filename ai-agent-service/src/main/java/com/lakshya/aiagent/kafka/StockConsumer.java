package com.lakshya.aiagent.kafka;

import com.lakshya.aiagent.model.StockEvent;
import com.lakshya.aiagent.service.AIOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StockConsumer {

    private final AIOrchestratorService aiOrchestratorService;

    @KafkaListener(topics = "stock-price-updates", groupId = "ai-agent-group")
    public void consume(StockEvent event) {

        System.out.println("Received stock event: " + event);

        aiOrchestratorService.processStockEvent(event);
    }
}