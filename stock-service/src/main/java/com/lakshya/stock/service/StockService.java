package com.lakshya.stock.service;

import com.lakshya.stock.entity.Stock;
import java.util.List;

public interface StockService {

    List<Stock> getAllStocks();

    Stock saveStock(Stock stock);

    Stock fetchStockFromYahoo(String symbol);
}