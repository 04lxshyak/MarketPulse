package com.lakshya.aiagent.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.aiagent.model.RecommendationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecommendationProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendRecommendation(RecommendationEvent event) {

        try {

            String message = objectMapper.writeValueAsString(event);

            kafkaTemplate.send("stock-recommendations", message);

            System.out.println("Sent recommendation: " + message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}