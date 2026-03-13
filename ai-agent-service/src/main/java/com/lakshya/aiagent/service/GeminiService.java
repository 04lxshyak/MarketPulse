package com.lakshya.aiagent.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String analyzeStock(String prompt) throws Exception {

        OkHttpClient client = new OkHttpClient();

        String body = """
        {
          "contents":[
            {
              "parts":[{"text":"%s"}]
            }
          ]
        }
        """.formatted(prompt);

        Request request = new Request.Builder()
                .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" + apiKey)
                .post(RequestBody.create(body, MediaType.parse("application/json")))
                .build();

        Response response = client.newCall(request).execute();

        return response.body().string();
    }
}