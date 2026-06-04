package com.lakshya.stock.service;

import com.lakshya.stock.entity.Stock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StockSignalService {

    @Value("${market.signals.cooldown-ms:60000}")
    private long cooldownMs;

    @Value("${market.signals.price-change-threshold-percent:0.5}")
    private double priceChangeThresholdPercent;

    private final Map<String, PublishedSignal> publishedSignals = new ConcurrentHashMap<>();

    public boolean shouldPublish(Stock previousSnapshot, Stock currentSnapshot) {
        String symbol = currentSnapshot.getSymbol();
        long currentTime = currentSnapshot.getUpdatedAt()
                .atZone(ZoneId.systemDefault())
                .toInstant()
                .toEpochMilli();

        PublishedSignal previousSignal = publishedSignals.get(symbol);
        if (previousSignal == null) {
            publishedSignals.put(symbol, PublishedSignal.from(currentSnapshot, currentTime));
            return true;
        }

        if (currentTime - previousSignal.timestamp < cooldownMs) {
            return false;
        }

        boolean priceMoved = percentChange(previousSignal.price, currentSnapshot.getPrice()) >= priceChangeThresholdPercent;
        boolean brokeHigh = previousSnapshot != null && currentSnapshot.getPrice() > previousSnapshot.getHigh();
        boolean brokeLow = previousSnapshot != null && currentSnapshot.getPrice() < previousSnapshot.getLow();

        if (priceMoved || brokeHigh || brokeLow) {
            publishedSignals.put(symbol, PublishedSignal.from(currentSnapshot, currentTime));
            return true;
        }

        return false;
    }

    private double percentChange(double previous, double current) {
        if (previous <= 0) {
            return 0;
        }
        return Math.abs((current - previous) / previous) * 100;
    }

    private record PublishedSignal(String symbol, double price, long timestamp) {
        private static PublishedSignal from(Stock stock, long timestamp) {
            return new PublishedSignal(stock.getSymbol(), stock.getPrice(), timestamp);
        }
    }
}
