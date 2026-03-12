package com.lakshya.stock.kafka;

import com.lakshya.stock.entity.Stock;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockProducer {

    private final KafkaTemplate<String, Stock> kafkaTemplate;

    private static final String TOPIC = "stock-price-updates";

    public void sendStockUpdate(Stock stock) {

        kafkaTemplate.send(TOPIC, stock);

        System.out.println("Stock event sent to Kafka: " + stock.getSymbol());
    }
}