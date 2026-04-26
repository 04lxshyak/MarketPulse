package com.lakshya.aiagent.controller;

import com.lakshya.aiagent.dto.UserQueryRequest;
import com.lakshya.aiagent.dto.UserQueryResponse;
import com.lakshya.aiagent.service.AIOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Agent Service is running");
    }
}
