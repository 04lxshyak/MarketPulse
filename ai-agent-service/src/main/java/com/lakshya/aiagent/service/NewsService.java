package com.lakshya.aiagent.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NewsService {

    @Value("${news.api.key}")
    private String apiKey;

    @Value("${news.api.base-url}")
    private String baseUrl;

    private final OkHttpClient client = new OkHttpClient();

    public String getNews(String symbol) {

        try {
            if (apiKey == null || apiKey.isBlank()) {
                return "";
            }

            String normalizedSymbol = normalizeSymbol(symbol);
            HttpUrl url = HttpUrl.parse(baseUrl)
                    .newBuilder()
                    .addQueryParameter("api_token", apiKey)
                    .addQueryParameter("symbols", normalizedSymbol)
                    .addQueryParameter("language", "en")
                    .addQueryParameter("limit", "5")
                    .addQueryParameter("must_have_entities", "true")
                    .build();

            Request request = new Request.Builder()
                    .url(url)
                    .build();

            Response response = client.newCall(request).execute();

            if(response.body()!=null){
                return response.body().string();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "";
    }

    private String normalizeSymbol(String symbol) {
        if (symbol == null || symbol.isBlank()) {
            return "";
        }
        return symbol.trim().toUpperCase();
    }
}
