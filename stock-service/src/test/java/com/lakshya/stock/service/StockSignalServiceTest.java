package com.lakshya.stock.service;

import com.lakshya.stock.entity.Stock;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class StockSignalServiceTest {

    @Test
    void publishesFirstSignalThenBlocksWithinCooldown() {
        StockSignalService signalService = newService();

        assertThat(signalService.shouldPublish(null, stock("AAPL", 100, 100, 99, "2026-01-01T10:00:00"))).isTrue();
        assertThat(signalService.shouldPublish(
                stock("AAPL", 100, 101, 99, "2026-01-01T10:00:00"),
                stock("AAPL", 101, 101, 99, "2026-01-01T10:00:30")
        )).isFalse();
    }

    @Test
    void publishesAfterCooldownWhenPriceMovesEnough() {
        StockSignalService signalService = newService();

        signalService.shouldPublish(null, stock("AAPL", 100, 100, 99, "2026-01-01T10:00:00"));

        boolean shouldPublish = signalService.shouldPublish(
                stock("AAPL", 100, 100, 99, "2026-01-01T10:00:00"),
                stock("AAPL", 101, 101, 99, "2026-01-01T10:01:01")
        );

        assertThat(shouldPublish).isTrue();
    }

    private StockSignalService newService() {
        StockSignalService signalService = new StockSignalService();
        ReflectionTestUtils.setField(signalService, "cooldownMs", 60_000L);
        ReflectionTestUtils.setField(signalService, "priceChangeThresholdPercent", 0.5);
        return signalService;
    }

    private Stock stock(String symbol, double price, double high, double low, String updatedAt) {
        return Stock.builder()
                .symbol(symbol)
                .price(price)
                .high(high)
                .low(low)
                .updatedAt(LocalDateTime.parse(updatedAt))
                .build();
    }
}
