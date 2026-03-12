package com.lakshya.stock.scheduler;

import com.lakshya.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StockScheduler {

    private final StockService stockService;

    @Scheduled(fixedRate = 60000)
    public void updateStocks() {

        stockService.fetchStockFromYahoo("RELIANCE.NS");
        stockService.fetchStockFromYahoo("TCS.NS");
        stockService.fetchStockFromYahoo("INFY.NS");
        stockService.fetchStockFromYahoo("HDFCBANK.NS");
        stockService.fetchStockFromYahoo("ITC.NS");

        System.out.println("Stocks Updated");
    }
}