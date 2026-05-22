package com.lakshya.aiagent.repository;

import com.lakshya.aiagent.model.StockPriceSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockPriceSnapshotRepository extends JpaRepository<StockPriceSnapshot, String> {

    List<StockPriceSnapshot> findTop20BySymbolOrderByUpdatedAtDesc(String symbol);
}
