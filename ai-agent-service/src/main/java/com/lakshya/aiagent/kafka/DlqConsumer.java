package com.lakshya.aiagent.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class DlqConsumer {

    private static final Logger log = LoggerFactory.getLogger(DlqConsumer.class);

    /**
     * Listens to the Dead Letter Topic for failed stock-price-updates messages.
     * Logs the failed event for monitoring and alerting.
     */
    @KafkaListener(topics = "stock-price-updates.DLT", groupId = "ai-agent-dlq-group")
    public void consumeDeadLetter(String message) {
        log.error("☠️ DLQ received failed message: {}", message);
        // Future: persist to a failures table, send alert, etc.
    }
}
