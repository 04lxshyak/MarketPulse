package com.lakshya.aiagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakshya.aiagent.dto.UserQueryRequest;
import com.lakshya.aiagent.dto.UserQueryResponse;
import com.lakshya.aiagent.kafka.RecommendationProducer;
import com.lakshya.aiagent.model.RecommendationEvent;
import com.lakshya.aiagent.model.StockEvent;
import com.lakshya.aiagent.model.StockRecommendation;
import com.lakshya.aiagent.repository.StockRecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * The "Brain" of the AI Agent architecture.
 * Performs intent classification and routes to specialized agents.
 *
 * Intents:
 *   - TECHNICALS  → StockAnalysisService (Investment Agent)
 *   - NEWS        → NewsService + GeminiService (News Agent)
 *   - GENERAL_KNOWLEDGE → RAGService (Knowledge Agent)
 */
@Service
@RequiredArgsConstructor
public class AIOrchestratorService {

    private static final Logger log = LoggerFactory.getLogger(AIOrchestratorService.class);

    private final GeminiService geminiService;
    private final StockAnalysisService stockAnalysisService;
    private final NewsService newsService;
    private final RAGService ragService;
    private final AiParserService aiParserService;
    private final RecommendationProducer recommendationProducer;
    private final StockRecommendationRepository repository;

    private final ObjectMapper mapper = new ObjectMapper();

    // ─── Kafka-triggered flow (stock-price-updates) ─────────────────────────────

    /**
     * Called by StockConsumer when a stock-price-updates event arrives.
     * This bypasses intent classification and directly runs the full
     * TECHNICALS pipeline (existing behaviour preserved).
     */
    public void processStockEvent(StockEvent stockEvent) {
        try {
            log.info("🔍 Processing stock event for {}", stockEvent.getSymbol());

            // 1. RAG context retrieval
            String contextPrefix = stockEvent.getSymbol() + " current price: " + stockEvent.getPrice();
            String historicalContext = ragService.retrieveSimilarContext(stockEvent.getSymbol(), contextPrefix);

            // 2. Full analysis (news + Gemini)
            String aiResponse = stockAnalysisService.analyze(stockEvent, historicalContext);

            // 3. Parse
            StockRecommendation entity = aiParserService.parse(aiResponse);
            if ("UNKNOWN".equals(entity.getSymbol())) {
                entity.setSymbol(stockEvent.getSymbol());
            }
            entity.setTimestamp(System.currentTimeMillis());

            // 4. Persist
            repository.save(entity);
            log.info("✅ Saved recommendation: symbol={}, action={}", entity.getSymbol(), entity.getRecommendation());

            // 5. Store embedding for future RAG
            ragService.storeEmbedding(entity);

            // 6. Publish to Kafka
            RecommendationEvent event = new RecommendationEvent(
                    entity.getSymbol(),
                    entity.getRecommendation(),
                    entity.getSentiment(),
                    entity.getReason()
            );
            recommendationProducer.sendRecommendation(event);
            log.info("📤 Published recommendation to Kafka: symbol={}", entity.getSymbol());

        } catch (Exception e) {
            log.error("❌ Failed to process stock event for {}: {}", stockEvent.getSymbol(), e.getMessage(), e);
        }
    }

    // ─── User-query flow (REST API) ─────────────────────────────────────────────

    /**
     * Handles a free-form user query by:
     *  1. Classifying intent via a fast Gemini call
     *  2. Routing to the correct specialized agent
     *  3. Returning a structured response
     */
    public UserQueryResponse handleUserQuery(UserQueryRequest request) {
        try {
            log.info("🧠 Classifying user query: {}", request.getQuery());

            // ── Step 1: Intent Classification ──
            String classificationPrompt = String.format(
                "You are the central router for a financial AI system.\n" +
                "Classify the following user input into EXACTLY ONE of these categories:\n" +
                "  TECHNICALS - questions about stock prices, charts, buy/sell/hold, technical analysis\n" +
                "  NEWS       - questions about recent news, market sentiment, company events\n" +
                "  GENERAL_KNOWLEDGE - general questions about finance, investing concepts, company history\n\n" +
                "Also extract the stock ticker symbol if mentioned (e.g., AAPL, RELIANCE.NS, TCS.NS).\n" +
                "If no specific symbol is mentioned, use \"GENERAL\".\n\n" +
                "Return ONLY valid JSON:\n" +
                "{\"intent\": \"TECHNICALS|NEWS|GENERAL_KNOWLEDGE\", \"symbol\": \"<ticker or GENERAL>\"}\n\n" +
                "User input: %s",
                request.getQuery()
            );

            String classificationRaw = geminiService.analyzeStock(
                    "SYSTEM", 0, 0, 0, 0, "", classificationPrompt
            );

            String intent = "GENERAL_KNOWLEDGE";
            String symbol = request.getSymbol() != null ? request.getSymbol() : "GENERAL";

            try {
                // Extract JSON from potential markdown fencing
                java.util.regex.Matcher m = java.util.regex.Pattern
                        .compile("\\{.*\\}", java.util.regex.Pattern.DOTALL)
                        .matcher(classificationRaw);

                if (m.find()) {
                    JsonNode classification = mapper.readTree(m.group(0));
                    intent = classification.path("intent").asText("GENERAL_KNOWLEDGE");
                    String extractedSymbol = classification.path("symbol").asText("GENERAL");
                    if (!"GENERAL".equals(extractedSymbol) && !extractedSymbol.isEmpty()) {
                        symbol = extractedSymbol;
                    }
                }
            } catch (Exception e) {
                log.warn("⚠️ Classification parsing failed, defaulting to GENERAL_KNOWLEDGE: {}", e.getMessage());
            }

            log.info("📋 Classified intent={}, symbol={}", intent, symbol);

            // ── Step 2: Route to Specialized Agent ──
            return switch (intent) {
                case "TECHNICALS" -> handleTechnicals(request.getQuery(), symbol);
                case "NEWS" -> handleNews(request.getQuery(), symbol);
                default -> handleGeneralKnowledge(request.getQuery(), symbol);
            };

        } catch (Exception e) {
            log.error("❌ Query processing failed: {}", e.getMessage(), e);
            return UserQueryResponse.builder()
                    .intent("ERROR")
                    .symbol("UNKNOWN")
                    .answer("Sorry, I encountered an error processing your query. Please try again.")
                    .confidence(0)
                    .build();
        }
    }

    // ─── Specialized Agent Handlers ──────────────────────────────────────────────

    private UserQueryResponse handleTechnicals(String query, String symbol) {
        log.info("📊 Routing to Investment Agent for {}", symbol);

        // Retrieve RAG context
        String context = ragService.retrieveSimilarContext(symbol, query);

        // Build a focused technical analysis prompt
        String prompt = String.format(
            "You are a professional stock market technical analyst.\n" +
            "The user asks: \"%s\"\n\n" +
            "Historical context from RAG:\n%s\n\n" +
            "Provide a concise technical analysis. Return ONLY valid JSON:\n" +
            "{\"symbol\": \"%s\", \"recommendation\": \"BUY|SELL|HOLD\", " +
            "\"sentiment\": \"POSITIVE|NEGATIVE|NEUTRAL\", " +
            "\"risk_level\": \"LOW|MEDIUM|HIGH\", " +
            "\"confidence\": <integer 0-100>, " +
            "\"reason\": \"<concise explanation>\"}",
            query, context.isEmpty() ? "No prior context available." : context, symbol
        );

        String aiResponse = geminiService.analyzeStock(symbol, 0, 0, 0, 0, "", prompt);
        StockRecommendation parsed = aiParserService.parse(aiResponse);

        return UserQueryResponse.builder()
                .intent("TECHNICALS")
                .symbol(symbol)
                .answer(parsed.getReason())
                .sentiment(parsed.getSentiment())
                .recommendation(parsed.getRecommendation())
                .confidence(parsed.getConfidence())
                .riskLevel(parsed.getRiskLevel())
                .build();
    }

    private UserQueryResponse handleNews(String query, String symbol) {
        log.info("📰 Routing to News Agent for {}", symbol);

        // Fetch news
        String news = newsService.getNews(symbol);

        // Build a news-focused prompt
        String prompt = String.format(
            "You are a financial news analyst AI.\n" +
            "The user asks: \"%s\"\n\n" +
            "Here is the latest news data:\n%s\n\n" +
            "Summarize the key news points and assess the overall sentiment. " +
            "Return ONLY valid JSON:\n" +
            "{\"symbol\": \"%s\", \"recommendation\": \"BUY|SELL|HOLD\", " +
            "\"sentiment\": \"POSITIVE|NEGATIVE|NEUTRAL\", " +
            "\"risk_level\": \"LOW|MEDIUM|HIGH\", " +
            "\"confidence\": <integer 0-100>, " +
            "\"reason\": \"<news summary and sentiment assessment>\"}",
            query, news.isEmpty() ? "No recent news found." : news.substring(0, Math.min(news.length(), 3000)), symbol
        );

        String aiResponse = geminiService.analyzeStock(symbol, 0, 0, 0, 0, "", prompt);
        StockRecommendation parsed = aiParserService.parse(aiResponse);

        return UserQueryResponse.builder()
                .intent("NEWS")
                .symbol(symbol)
                .answer(parsed.getReason())
                .sentiment(parsed.getSentiment())
                .recommendation(parsed.getRecommendation())
                .confidence(parsed.getConfidence())
                .riskLevel(parsed.getRiskLevel())
                .build();
    }

    private UserQueryResponse handleGeneralKnowledge(String query, String symbol) {
        log.info("📚 Routing to Knowledge Agent for {}", symbol);

        // RAG retrieval
        String context = ragService.retrieveSimilarContext(symbol, query);

        // Build a knowledge-focused prompt
        String prompt = String.format(
            "You are a knowledgeable financial advisor AI.\n" +
            "The user asks: \"%s\"\n\n" +
            "Relevant context from knowledge base:\n%s\n\n" +
            "Provide a helpful and informative answer. " +
            "Return ONLY valid JSON:\n" +
            "{\"symbol\": \"%s\", \"recommendation\": \"HOLD\", " +
            "\"sentiment\": \"NEUTRAL\", " +
            "\"risk_level\": \"LOW\", " +
            "\"confidence\": <integer 0-100>, " +
            "\"reason\": \"<your detailed answer>\"}",
            query, context.isEmpty() ? "No specific context available." : context, symbol
        );

        String aiResponse = geminiService.analyzeStock(symbol, 0, 0, 0, 0, "", prompt);
        StockRecommendation parsed = aiParserService.parse(aiResponse);

        return UserQueryResponse.builder()
                .intent("GENERAL_KNOWLEDGE")
                .symbol(symbol)
                .answer(parsed.getReason())
                .sentiment(parsed.getSentiment())
                .recommendation(parsed.getRecommendation())
                .confidence(parsed.getConfidence())
                .riskLevel(parsed.getRiskLevel())
                .build();
    }
}