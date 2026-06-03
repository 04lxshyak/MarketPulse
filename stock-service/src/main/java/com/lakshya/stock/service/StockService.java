package com.lakshya.stock.service;

import com.lakshya.stock.entity.Stock;
import java.util.List;

public interface StockService {

    List<Stock> getAllStocks();

    Stock getLatestStock(String symbol);

    Stock saveStock(Stock stock);

    Stock ingestTrade(String symbol, double price, long volume, Long eventTimestamp);
}
