package com.lakshya.stock.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.stock.entity.Stock;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    private final ObjectMapper objectMapper =
            new ObjectMapper().findAndRegisterModules();

    private static final String TOPIC = "stock-price-updates";

    public void sendStockUpdate(Stock stock) {

        try {

            String stockJson = objectMapper.writeValueAsString(stock);

            kafkaTemplate.send(TOPIC, stock.getSymbol(), stockJson);

            System.out.println("Sent stock event: " + stockJson);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}