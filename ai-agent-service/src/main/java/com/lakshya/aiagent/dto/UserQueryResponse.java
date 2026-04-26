package com.lakshya.aiagent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserQueryResponse {
    private String intent;       // NEWS, TECHNICALS, GENERAL_KNOWLEDGE
    private String symbol;
    private String answer;
    private String sentiment;
    private String recommendation;
    private int confidence;
    private String riskLevel;
}
