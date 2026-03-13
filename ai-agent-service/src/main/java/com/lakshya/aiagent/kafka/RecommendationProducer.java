package com.lakshya.aiagent.kafka;

import com.lakshya.aiagent.model.RecommendationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationProducer {

    private final KafkaTemplate<String, RecommendationEvent> kafkaTemplate;

    private static final String TOPIC = "investment-recommendations";

    public void sendRecommendation(RecommendationEvent event){

        kafkaTemplate.send(TOPIC, event);

        System.out.println("Recommendation published: " + event);
    }
}