package com.lakshya.stock.service;

import com.lakshya.stock.entity.Stock;
import com.lakshya.stock.kafka.StockProducer;
import com.lakshya.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;
    private final RestTemplate restTemplate;
    private final StockProducer stockProducer;

    @Override
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @Override
    public Stock saveStock(Stock stock) {
        stock.setUpdatedAt(LocalDateTime.now());
        return stockRepository.save(stock);
    }

    @Override
    public Stock fetchStockFromYahoo(String symbol) {

        String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol;

        // Add headers to mimic browser request
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map body = response.getBody();

        Map chart = (Map) body.get("chart");
        List result = (List) chart.get("result");
        Map resultMap = (Map) result.get(0);

        Map meta = (Map) resultMap.get("meta");

        double price = ((Number) meta.get("regularMarketPrice")).doubleValue();
        double high = ((Number) meta.get("regularMarketDayHigh")).doubleValue();
        double low = ((Number) meta.get("regularMarketDayLow")).doubleValue();
        long volume = ((Number) meta.get("regularMarketVolume")).longValue();
        double previousClose = ((Number) meta.get("previousClose")).doubleValue();

        Stock stock = Stock.builder()
                .symbol(symbol)
                .price(price)
                .high(high)
                .low(low)
                .volume(volume)
                .previousClose(previousClose)
                .updatedAt(LocalDateTime.now())
                .build();

        Stock savedStock = stockRepository.save(stock);

        stockProducer.sendStockUpdate(savedStock);

        return savedStock;
    }
}