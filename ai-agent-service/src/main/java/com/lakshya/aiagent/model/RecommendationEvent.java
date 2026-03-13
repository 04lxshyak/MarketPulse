package com.lakshya.aiagent.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationEvent {

    private String symbol;
    private String recommendation;
    private String sentiment;
    private String reason;
}