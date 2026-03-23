package com.lakshya.aiagent.repository;

import com.lakshya.aiagent.model.StockRecommendation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRecommendationRepository
        extends JpaRepository<StockRecommendation, Long> {

    Page<StockRecommendation> findBySymbol(String symbol, Pageable pageable);
}