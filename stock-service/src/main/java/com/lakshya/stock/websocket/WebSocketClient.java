package com.lakshya.stock.websocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.stock.service.StockService;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
@RequiredArgsConstructor
public class WebSocketClient implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(WebSocketClient.class);

    private final StockService stockService;
    private final ObjectMapper mapper;
    private final ScheduledExecutorService reconnectExecutor = Executors.newSingleThreadScheduledExecutor();
    private final AtomicBoolean reconnectScheduled = new AtomicBoolean(false);

    @Value("${market.websocket.enabled:true}")
    private boolean enabled;

    @Value("${market.websocket.url:wss://ws.finnhub.io}")
    private String websocketUrl;

    @Value("${market.websocket.token:}")
    private String token;

    @Value("${market.websocket.symbols:AAPL,MSFT,NVDA,TSLA}")
    private String symbols;

    @Value("${market.websocket.reconnect-delay-ms:5000}")
    private long reconnectDelayMs;

    private volatile WebSocket webSocket;

    @Override
    public void run(ApplicationArguments args) {
        connect();
    }

    private void connect() {
        if (!enabled) {
            log.info("Market WebSocket feed is disabled");
            return;
        }
        if (token == null || token.isBlank()) {
            log.warn("FINNHUB_API_KEY is not configured. Stock WebSocket feed will not start.");
            return;
        }

        String endpoint = websocketUrl + "?token=" + token;
        HttpClient.newHttpClient()
                .newWebSocketBuilder()
                .buildAsync(URI.create(endpoint), new Listener())
                .whenComplete((socket, error) -> {
                    if (error != null) {
                        log.error("Failed to connect to market WebSocket: {}", error.getMessage());
                        scheduleReconnect();
                        return;
                    }

                    webSocket = socket;
                    reconnectScheduled.set(false);
                    subscribeToSymbols(socket);
                    log.info("Connected to market WebSocket feed");
                });
    }

    private void subscribeToSymbols(WebSocket socket) {
        for (String symbol : configuredSymbols()) {
            String message = mapper.createObjectNode()
                    .put("type", "subscribe")
                    .put("symbol", symbol)
                    .toString();

            socket.sendText(message, true);
            log.info("Subscribed to market WebSocket symbol {}", symbol);
        }
    }

    private List<String> configuredSymbols() {
        return Arrays.stream(symbols.split(","))
                .map(String::trim)
                .filter(symbol -> !symbol.isBlank())
                .map(String::toUpperCase)
                .toList();
    }

    private void handleMessage(String rawMessage) {
        try {
            JsonNode root = mapper.readTree(rawMessage);
            if (!"trade".equalsIgnoreCase(root.path("type").asText())) {
                return;
            }

            for (JsonNode trade : root.path("data")) {
                String symbol = trade.path("s").asText();
                double price = trade.path("p").asDouble();
                long volume = Math.round(trade.path("v").asDouble(0));
                long timestamp = trade.path("t").asLong(System.currentTimeMillis());

                if (symbol.isBlank() || price <= 0) {
                    continue;
                }

                stockService.ingestTrade(symbol, price, volume, timestamp);
            }
        } catch (Exception e) {
            log.error("Failed to process market WebSocket message: {}", e.getMessage());
        }
    }

    private void scheduleReconnect() {
        if (!enabled || !reconnectScheduled.compareAndSet(false, true)) {
            return;
        }

        reconnectExecutor.schedule(() -> {
            reconnectScheduled.set(false);
            connect();
        }, reconnectDelayMs, TimeUnit.MILLISECONDS);
    }

    @PreDestroy
    public void shutdown() {
        enabled = false;
        WebSocket socket = webSocket;
        if (socket != null) {
            socket.sendClose(WebSocket.NORMAL_CLOSURE, "stock-service shutting down");
        }
        reconnectExecutor.shutdownNow();
    }

    private class Listener implements WebSocket.Listener {

        private final StringBuilder partialMessage = new StringBuilder();

        @Override
        public void onOpen(WebSocket webSocket) {
            WebSocket.Listener.super.onOpen(webSocket);
            webSocket.request(1);
        }

        @Override
        public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
            partialMessage.append(data);
            if (last) {
                handleMessage(partialMessage.toString());
                partialMessage.setLength(0);
            }
            webSocket.request(1);
            return CompletableFuture.completedFuture(null);
        }

        @Override
        public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
            log.warn("Market WebSocket closed: status={}, reason={}", statusCode, reason);
            scheduleReconnect();
            return WebSocket.Listener.super.onClose(webSocket, statusCode, reason);
        }

        @Override
        public void onError(WebSocket webSocket, Throwable error) {
            log.error("Market WebSocket error: {}", error.getMessage());
            scheduleReconnect();
        }
    }
}
