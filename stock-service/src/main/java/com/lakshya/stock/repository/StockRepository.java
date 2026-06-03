package com.lakshya.stock.repository;

import com.lakshya.stock.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, String> {

    Optional<Stock> findBySymbol(String symbol);

    Optional<Stock> findTopBySymbolOrderByUpdatedAtDesc(String symbol);

    @Query(value = "SELECT DISTINCT ON (symbol) * FROM stock ORDER BY symbol, updated_at DESC", nativeQuery = true)
    List<Stock> findLatestPerSymbol();
}
