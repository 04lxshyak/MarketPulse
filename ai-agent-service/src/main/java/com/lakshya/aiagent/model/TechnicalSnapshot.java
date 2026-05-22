package com.lakshya.aiagent.model;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicalSnapshot {

    private String symbol;
    private double price;
    private double previousClose;
    private double dayHigh;
    private double dayLow;
    private long volume;
    private double priceChange;
    private double priceChangePercent;
    private double intradayRangePercent;
    private double closePositionPercent;
    private double windowStartPrice;
    private double windowEndPrice;
    private double windowChangePercent;
    private double averagePrice;
    private int observedSamples;
    private String trendDirection;
    private String volatilityLevel;
    private String volumeLevel;
    private String summary;
}
