package com.lakshya.aiagent.controller;

import com.lakshya.aiagent.dto.UserQueryRequest;
import com.lakshya.aiagent.dto.UserQueryResponse;
import com.lakshya.aiagent.model.StockRecommendation;
import com.lakshya.aiagent.service.AIRequestCooldownService;
import com.lakshya.aiagent.service.AIOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoint for user-facing AI queries.
 * Maps to the SOP's "user.requests" flow via REST instead of Kafka.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIQueryController {

    private final AIOrchestratorService orchestratorService;
    private final AIRequestCooldownService cooldownService;

    /**
     * POST /api/ai/query
     * Accepts a free-form user question, classifies intent,
     * routes to the correct agent, and returns structured results.
     */
    @PostMapping("/query")
    public ResponseEntity<UserQueryResponse> query(@RequestBody UserQueryRequest request) {
        UserQueryResponse response = orchestratorService.handleUserQuery(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/analyze/{symbol}")
    public ResponseEntity<StockRecommendation> analyzeSymbol(@PathVariable String symbol, Authentication authentication) {
        String user = authentication != null ? authentication.getName() : "anonymous";
        if (!cooldownService.tryAcquire(user, symbol)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }
        return ResponseEntity.ok(orchestratorService.analyzeLatestSymbol(symbol));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Agent Service is running");
    }
}
