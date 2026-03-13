package com.lakshya.aiagent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class StockEvent {

    private String symbol;
    private double price;
    private double high;
    private double low;
    private long volume;

}