package com.lakshya.stock.controller;

import com.lakshya.stock.entity.Stock;
import com.lakshya.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/fetch/{symbol}")
    public Stock fetchStock(@PathVariable String symbol) {
        return stockService.fetchStockFromYahoo(symbol);
    }
}