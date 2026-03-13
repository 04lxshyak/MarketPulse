package com.lakshya.aiagent.model;

import lombok.Data;

@Data
public class StockEvent {

    private String symbol;
    private double price;
    private double high;
    private double low;
    private long volume;
}