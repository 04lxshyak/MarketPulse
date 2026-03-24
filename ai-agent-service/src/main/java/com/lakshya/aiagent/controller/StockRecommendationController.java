package com.lakshya.aiagent.controller;

import com.lakshya.aiagent.dto.PaginatedResponse;
import com.lakshya.aiagent.model.StockRecommendation;
import com.lakshya.aiagent.repository.StockRecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StockRecommendationController {

    private final StockRecommendationRepository repository;

    @GetMapping
    public PaginatedResponse<StockRecommendation> getRecommendations(
            @RequestParam(required = false) String symbol,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StockRecommendation> resultPage;

        if (symbol != null && !symbol.isBlank()) {
            resultPage = repository.findBySymbol(symbol.toUpperCase(), pageable);
        } else {
            resultPage = repository.findAll(pageable);
        }

        return new PaginatedResponse<>(
                resultPage.getContent(),
                resultPage.getTotalPages(),
                resultPage.getTotalElements(),
                resultPage.getNumber()
        );
    }
}
