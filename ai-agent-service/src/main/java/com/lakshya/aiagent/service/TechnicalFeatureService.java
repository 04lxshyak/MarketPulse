package com.lakshya.aiagent.service;

import com.lakshya.aiagent.model.StockPriceSnapshot;
import com.lakshya.aiagent.model.StockEvent;
import com.lakshya.aiagent.model.TechnicalSnapshot;
import com.lakshya.aiagent.repository.StockPriceSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TechnicalFeatureService {

    private final StockPriceSnapshotRepository stockPriceSnapshotRepository;

    public TechnicalSnapshot buildSnapshot(StockEvent stock) {
        double price = stock.getPrice();
        double previousClose = stock.getPreviousClose();
        double high = stock.getHigh();
        double low = stock.getLow();
        List<StockPriceSnapshot> recentSnapshots = stockPriceSnapshotRepository.findTop20BySymbolOrderByUpdatedAtDesc(stock.getSymbol());

        double priceChange = previousClose > 0 ? price - previousClose : 0;
        double priceChangePercent = previousClose > 0 ? (priceChange / previousClose) * 100 : 0;
        double intradayRangePercent = price > 0 && high >= low ? ((high - low) / price) * 100 : 0;
        double closePositionPercent = high > low ? ((price - low) / (high - low)) * 100 : 50;
        double windowStartPrice = calculateWindowStartPrice(recentSnapshots, price);
        double windowEndPrice = recentSnapshots.isEmpty() ? price : recentSnapshots.get(0).getPrice();
        double windowChangePercent = windowStartPrice > 0 ? ((windowEndPrice - windowStartPrice) / windowStartPrice) * 100 : 0;
        double averagePrice = calculateAveragePrice(recentSnapshots, price);

        return TechnicalSnapshot.builder()
                .symbol(stock.getSymbol())
                .price(round(price))
                .previousClose(round(previousClose))
                .dayHigh(round(high))
                .dayLow(round(low))
                .volume(stock.getVolume())
                .priceChange(round(priceChange))
                .priceChangePercent(round(priceChangePercent))
                .intradayRangePercent(round(intradayRangePercent))
                .closePositionPercent(round(closePositionPercent))
                .windowStartPrice(round(windowStartPrice))
                .windowEndPrice(round(windowEndPrice))
                .windowChangePercent(round(windowChangePercent))
                .averagePrice(round(averagePrice))
                .observedSamples(recentSnapshots.size())
                .trendDirection(classifyTrend(priceChangePercent, closePositionPercent, windowChangePercent))
                .volatilityLevel(classifyVolatility(intradayRangePercent))
                .volumeLevel(classifyVolume(stock.getVolume()))
                .summary(buildSummary(stock.getSymbol(), priceChangePercent, intradayRangePercent, closePositionPercent, windowChangePercent, recentSnapshots.size(), stock.getVolume()))
                .build();
    }

    public String toEmbeddingText(TechnicalSnapshot snapshot) {
        return String.format(
                "Symbol: %s. Price: %.2f. Previous close: %.2f. Price change: %.2f%%. " +
                        "Intraday range: %.2f%%. Close position in day's range: %.2f%%. " +
                        "Recent window start price: %.2f. Recent window end price: %.2f. Recent window change: %.2f%%. " +
                        "Average recent price: %.2f across %d samples. Trend: %s. Volatility: %s. Volume level: %s.",
                snapshot.getSymbol(),
                snapshot.getPrice(),
                snapshot.getPreviousClose(),
                snapshot.getPriceChangePercent(),
                snapshot.getIntradayRangePercent(),
                snapshot.getClosePositionPercent(),
                snapshot.getWindowStartPrice(),
                snapshot.getWindowEndPrice(),
                snapshot.getWindowChangePercent(),
                snapshot.getAveragePrice(),
                snapshot.getObservedSamples(),
                snapshot.getTrendDirection(),
                snapshot.getVolatilityLevel(),
                snapshot.getVolumeLevel()
        );
    }

    private String classifyTrend(double priceChangePercent, double closePositionPercent, double windowChangePercent) {
        if ((priceChangePercent >= 1.5 || windowChangePercent >= 1.5) && closePositionPercent >= 65) {
            return "BULLISH";
        }
        if ((priceChangePercent <= -1.5 || windowChangePercent <= -1.5) && closePositionPercent <= 35) {
            return "BEARISH";
        }
        return "SIDEWAYS";
    }

    private String classifyVolatility(double intradayRangePercent) {
        if (intradayRangePercent >= 3) {
            return "HIGH";
        }
        if (intradayRangePercent >= 1) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private String classifyVolume(long volume) {
        if (volume >= 10_000_000) {
            return "HIGH";
        }
        if (volume >= 1_000_000) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private String buildSummary(String symbol, double priceChangePercent, double intradayRangePercent, double closePositionPercent, double windowChangePercent, int observedSamples, long volume) {
        return String.format(
                "%s moved %.2f%% from previous close, changed %.2f%% across the recent %d saved snapshots, traded in a %.2f%% intraday range, closed at %.2f%% of the day's range, with volume %d.",
                symbol,
                round(priceChangePercent),
                round(windowChangePercent),
                observedSamples,
                round(intradayRangePercent),
                round(closePositionPercent),
                volume
        );
    }

    private double calculateWindowStartPrice(List<StockPriceSnapshot> recentSnapshots, double fallbackPrice) {
        if (recentSnapshots.isEmpty()) {
            return fallbackPrice;
        }
        return recentSnapshots.get(recentSnapshots.size() - 1).getPrice();
    }

    private double calculateAveragePrice(List<StockPriceSnapshot> recentSnapshots, double fallbackPrice) {
        if (recentSnapshots.isEmpty()) {
            return fallbackPrice;
        }
        return recentSnapshots.stream()
                .mapToDouble(StockPriceSnapshot::getPrice)
                .average()
                .orElse(fallbackPrice);
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
