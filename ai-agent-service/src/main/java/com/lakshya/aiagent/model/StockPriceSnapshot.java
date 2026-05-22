package com.lakshya.aiagent.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "stock")
public class StockPriceSnapshot {

    @Id
    private String id;

    private String symbol;
    private double price;
    private double high;
    private double low;
    private long volume;
    private double previousClose;
    private LocalDateTime updatedAt;
}
