package com.lakshya.stock.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String symbol;

    private double price;

    private double high;

    private double low;

    private long volume;

    private double previousClose;

    private LocalDateTime updatedAt;
}