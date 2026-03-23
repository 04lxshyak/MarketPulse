package com.lakshya.aiagent.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.CommonErrorHandler;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaRetryConfig {

    private static final Logger log = LoggerFactory.getLogger(KafkaRetryConfig.class);

    /**
     * Configures retry with exponential backoff and Dead Letter Topic (DLT).
     * - Retries 3 times with 2-second intervals.
     * - After exhausting retries, publishes the failed record to {topic}.DLT.
     */
    @Bean
    public CommonErrorHandler errorHandler(KafkaTemplate<String, Object> kafkaTemplate) {

        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(kafkaTemplate);

        // 3 retries, 2000ms between each
        DefaultErrorHandler errorHandler = new DefaultErrorHandler(recoverer, new FixedBackOff(2000L, 3L));

        errorHandler.setRetryListeners((record, ex, deliveryAttempt) ->
                log.warn("⚠️ Retry attempt {} for record on topic '{}', key='{}'. Error: {}",
                        deliveryAttempt,
                        record.topic(),
                        record.key(),
                        ex.getMessage())
        );

        return errorHandler;
    }
}
