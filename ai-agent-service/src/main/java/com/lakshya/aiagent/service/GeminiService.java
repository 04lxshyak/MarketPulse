package com.lakshya.aiagent.service;

import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();

    public String analyzeStock(String symbol,
                               double price,
                               double high,
                               double low,
                               long volume,
                               String news) {

        try {

            String prompt =
                    """
                    You are a professional stock market analyst AI.

                    Analyze the following stock data and latest market news.
                    Your goal is to provide a rational investment recommendation.

                    Perform these steps internally:
                    1. Analyze price relative to high/low range
                    2. Evaluate trading volume strength
                    3. Detect possible bullish or bearish signals
                    4. Analyze sentiment from the news
                    5. Assess risk level
                    6. Provide a final investment recommendation

                    STOCK DATA
                    ----------
                    Symbol: %s
                    Current Price: %.2f
                    Day High: %.2f
                    Day Low: %.2f
                    Volume: %d

                    MARKET NEWS
                    -----------
                    %s

                    RESPONSE FORMAT
                    Return ONLY valid JSON.

                    {
                      "symbol": "%s",
                      "recommendation": "BUY | SELL | HOLD",
                      "sentiment": "POSITIVE | NEGATIVE | NEUTRAL",
                      "risk_level": "LOW | MEDIUM | HIGH",
                      "confidence": "0-100",
                      "reason": "Short explanation in 1-2 sentences"
                    }

                    Rules:
                    - Be conservative like a professional analyst
                    - If news sentiment is negative, avoid BUY
                    - If price near high with weak volume → HOLD
                    - If price near low with positive news → BUY opportunity
                    - If strong negative sentiment → SELL
                    """.formatted(
                            symbol,
                            price,
                            high,
                            low,
                            volume,
                            news,
                            symbol
                    );

            String json = """
                    {
                      "contents": [
                        {
                          "parts": [
                            {"text": "%s"}
                          ]
                        }
                      ]
                    }
                    """.formatted(prompt.replace("\"","\\\""));

            RequestBody body = RequestBody.create(
                    json,
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey)
                    .post(body)
                    .build();

            Response response = client.newCall(request).execute();

            if (response.body() != null) {
                return response.body().string();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "AI_ERROR";
    }
}