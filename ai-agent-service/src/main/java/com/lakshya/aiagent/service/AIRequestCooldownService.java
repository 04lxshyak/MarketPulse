package com.lakshya.aiagent.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AIRequestCooldownService {

    private final Clock clock;
    private final Map<String, Long> lastRequestByUserAndSymbol = new ConcurrentHashMap<>();

    @Value("${ai.request-cooldown-ms:60000}")
    private long cooldownMs;

    public AIRequestCooldownService() {
        this(Clock.systemUTC());
    }

    AIRequestCooldownService(Clock clock) {
        this.clock = clock;
    }

    public boolean tryAcquire(String user, String symbol) {
        long now = clock.millis();
        String key = normalize(user) + ":" + normalize(symbol);
        Long previous = lastRequestByUserAndSymbol.get(key);

        if (previous != null && now - previous < cooldownMs) {
            return false;
        }

        lastRequestByUserAndSymbol.put(key, now);
        return true;
    }

    private String normalize(String value) {
        return value == null ? "UNKNOWN" : value.trim().toUpperCase();
    }
}
