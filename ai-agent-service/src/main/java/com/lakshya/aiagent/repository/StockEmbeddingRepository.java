package com.lakshya.aiagent.repository;

import com.lakshya.aiagent.model.StockEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockEmbeddingRepository extends JpaRepository<StockEmbedding, Long> {

    @Query(value = "SELECT * FROM stock_embedding WHERE symbol = :symbol ORDER BY embedding <-> cast(:vector as vector) LIMIT :maxResults", nativeQuery = true)
    List<StockEmbedding> findSimilarBySymbol(@Param("symbol") String symbol, @Param("vector") String vector, @Param("maxResults") int maxResults);
}
