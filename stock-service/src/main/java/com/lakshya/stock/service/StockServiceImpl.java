package com.lakshya.stock.service;

import com.lakshya.stock.entity.Stock;
import com.lakshya.stock.kafka.StockProducer;
import com.lakshya.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;
    private final StockProducer stockProducer;

    @Override
    public List<Stock> getAllStocks() {
        return stockRepository.findLatestPerSymbol();
    }

    @Override
    public Stock getLatestStock(String symbol) {
        return stockRepository.findTopBySymbolOrderByUpdatedAtDesc(normalizeSymbol(symbol))
                .orElseThrow(() -> new RuntimeException("Stock data not found for symbol: " + symbol));
    }

    @Override
    public Stock saveStock(Stock stock) {
        stock.setUpdatedAt(LocalDateTime.now());
        Stock savedStock = stockRepository.save(stock);
        stockProducer.sendStockUpdate(savedStock);
        return savedStock;
    }

    @Override
    @Transactional
    public Stock ingestTrade(String symbol, double price, long volume, Long eventTimestamp) {
        String normalizedSymbol = normalizeSymbol(symbol);
        LocalDateTime updatedAt = resolveUpdatedAt(eventTimestamp);
        Stock latest = stockRepository.findTopBySymbolOrderByUpdatedAtDesc(normalizedSymbol).orElse(null);
        boolean sameTradingDay = latest != null
                && latest.getUpdatedAt() != null
                && latest.getUpdatedAt().toLocalDate().equals(updatedAt.toLocalDate());

        double previousClose = resolvePreviousClose(latest, price, sameTradingDay);
        double high = sameTradingDay ? Math.max(latest.getHigh(), price) : price;
        double low = sameTradingDay && latest.getLow() > 0 ? Math.min(latest.getLow(), price) : price;
        long normalizedVolume = Math.max(volume, 0);
        long cumulativeVolume = sameTradingDay ? latest.getVolume() + normalizedVolume : normalizedVolume;

        Stock stock = Stock.builder()
                .symbol(normalizedSymbol)
                .price(price)
                .high(high)
                .low(low)
                .volume(cumulativeVolume)
                .previousClose(previousClose)
                .updatedAt(updatedAt)
                .build();

        Stock savedStock = stockRepository.save(stock);
        stockProducer.sendStockUpdate(savedStock);
        return savedStock;
    }

    private String normalizeSymbol(String symbol) {
        return symbol == null ? "" : symbol.trim().toUpperCase();
    }

    private LocalDateTime resolveUpdatedAt(Long eventTimestamp) {
        if (eventTimestamp == null || eventTimestamp <= 0) {
            return LocalDateTime.now();
        }
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(eventTimestamp), ZoneId.systemDefault());
    }

    private double resolvePreviousClose(Stock latest, double price, boolean sameTradingDay) {
        if (latest == null) {
            return price;
        }
        if (sameTradingDay && latest.getPreviousClose() > 0) {
            return latest.getPreviousClose();
        }
        return latest.getPrice();
    }
}
