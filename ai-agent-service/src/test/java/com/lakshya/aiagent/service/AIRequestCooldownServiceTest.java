package com.lakshya.aiagent.service;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

class AIRequestCooldownServiceTest {

    @Test
    void blocksRepeatedRequestForSameUserAndSymbol() {
        AIRequestCooldownService cooldownService = new AIRequestCooldownService(
                Clock.fixed(Instant.parse("2026-01-01T10:00:00Z"), ZoneOffset.UTC)
        );
        ReflectionTestUtils.setField(cooldownService, "cooldownMs", 60_000L);

        assertThat(cooldownService.tryAcquire("user@example.com", "aapl")).isTrue();
        assertThat(cooldownService.tryAcquire("USER@example.com", "AAPL")).isFalse();
        assertThat(cooldownService.tryAcquire("user@example.com", "MSFT")).isTrue();
    }
}
