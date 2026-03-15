package com.lakshya.aiagent.model;

import lombok.Data;

@Data
public class AIRecommendation {

    private String symbol;
    private String recommendation;
    private String sentiment;
    private String risk_level;
    private int confidence;
    private String reason;

}