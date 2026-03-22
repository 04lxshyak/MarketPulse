package com.lakshya.aiagent.repository;

import com.lakshya.aiagent.model.StockRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRecommendationRepository
        extends JpaRepository<StockRecommendation, Long> {
}