package com.lakshya.aiagent.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NewsService {

    @Value("${news.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();

    public String getNews(String symbol) {

        try {

            String company = symbol.replace(".NS","");

            String url =
                    "https://newsapi.org/v2/everything?q="
                            + company
                            + "&sortBy=publishedAt&apiKey="
                            + apiKey;

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
}