package com.lakshya.aiagent.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "stock_recommendations")
public class StockRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;

    private String recommendation; // BUY, SELL, HOLD

    private String sentiment;

    @Column(name = "risk_level")
    private String riskLevel;

    private int confidence;

    @Column(length = 1000)
    private String reason;

    private long timestamp;
}