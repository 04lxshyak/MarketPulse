package com.lakshya.aiagent.dto;

import lombok.Data;

@Data
public class UserQueryRequest {
    private String query;
    private String symbol; // optional, can be extracted from query
}
