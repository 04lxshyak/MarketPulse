package com.lakshya.aiagent.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "stock_recommendations", indexes = {@Index(columnList = "symbol")})
public class StockRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;

    private String recommendation; // BUY, SELL, HOLD

    private String sentiment;

    @JsonProperty("risk_level")
    @Column(name = "risk_level")
    private String riskLevel;

    private int confidence;

    @Column(length = 1000)
    private String reason;

    private long timestamp;
}
