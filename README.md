# MarketPulse

MarketPulse is an AI-powered stock recommendation system that ingests live market data, processes stock updates through an event-driven pipeline, and generates BUY, SELL, or HOLD insights using RAG and Gemini.

## Features

- React dashboard for stock signals, recommendations, symbol detail pages, and AI chat.
- Spring Boot microservice architecture.
- JWT-based authentication.
- WebSocket-based stock data ingestion.
- Selective background AI processing to avoid running inference on every tick.
- User-triggered AI analysis for specific stocks.
- Apache Kafka event pipeline for asynchronous processing.
- PostgreSQL persistence.
- pgvector-powered semantic retrieval for RAG.
- Gemini-powered recommendation generation and embedding creation.
- News enrichment for market-aware AI responses.

## Architecture

```text
Frontend
   |
   | REST APIs
   v
Auth Service        Stock Service
   |                    |
   |                    | WebSocket market feed
   |                    v
PostgreSQL          PostgreSQL
                        |
                        | Kafka: stock-price-updates
                        v
                  AI Agent Service
                        |
                        | RAG + news + Gemini
                        v
                  PostgreSQL + pgvector
                        |
                        | REST APIs
                        v
                    Frontend
```

## Services

### Frontend

Location:

```text
frontend
```

Tech stack:

- React
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- Recharts

Main routes:

```text
/                  Landing page
/login             Login
/register          Register
/dashboard         AI recommendation dashboard
/stocks            Tracked market assets
/symbol/:symbol    Symbol detail page
/feed              Recommendation feed
```

### Auth Service

Location:

```text
auth-service
```

Runs on:

```text
localhost:8081
```

Responsibilities:

- Register users.
- Login users.
- Generate JWT tokens.
- Validate authenticated user requests.

Main APIs:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Stock Service

Location:

```text
stock-service
```

Runs on:

```text
localhost:8082
```

Responsibilities:

- Connect to a market data WebSocket feed.
- Subscribe to configured stock symbols.
- Convert incoming trades into stock snapshots.
- Store latest stock data in PostgreSQL.
- Publish only meaningful stock signals to Kafka.

Main APIs:

```text
GET /api/stocks
GET /api/stocks/{symbol}
```

The old scheduled Yahoo Finance polling flow has been removed. The service now receives stock data through a WebSocket client. By default, the WebSocket URL is configured for Finnhub, but the URL and symbols are configurable through environment variables.

Kafka topic produced:

```text
stock-price-updates
```

The stock service stores every incoming WebSocket tick as a stock snapshot, but it does not publish every tick to Kafka. A lightweight signal detector applies a per-symbol cooldown and price-movement threshold before publishing background AI events. This keeps the AI service from being overloaded by noisy market ticks.

### AI Agent Service

Location:

```text
ai-agent-service
```

Runs on:

```text
localhost:8083
```

Responsibilities:

- Consume stock update events from Kafka.
- Run user-triggered stock analysis on demand.
- Build a technical snapshot from the current stock movement.
- Retrieve similar historical market setups using pgvector.
- Fetch related market news.
- Call Gemini for AI analysis.
- Parse and store recommendations.
- Store embeddings for future RAG retrieval.
- Serve recommendations and AI chat responses to the frontend.

Main APIs:

```text
GET  /api/recommendations
POST /api/ai/query
POST /api/ai/analyze/{symbol}
GET  /api/ai/health
```

Kafka topic consumed:

```text
stock-price-updates
```

## RAG Flow

The AI service uses RAG so that recommendations are generated with both current and historical context.

```text
Stock event received
   |
   v
Build technical snapshot
   |
   v
Generate embedding for current setup
   |
   v
Search pgvector for similar past setups
   |
   v
Retrieve previous recommendations and market context
   |
   v
Send current data + news + historical context to Gemini
   |
   v
Generate recommendation
   |
   v
Store recommendation + embedding for future RAG
```

## AI Processing Strategy

MarketPulse separates continuous data ingestion from expensive AI inference.

```text
Every WebSocket tick
   |
   v
Save stock snapshot
```

Background AI analysis runs selectively:

```text
Meaningful price movement + cooldown passed
   |
   v
Publish Kafka event
   |
   v
AI Agent generates recommendation
```

User-triggered analysis runs on demand:

```text
User clicks Analyze
   |
   v
AI Agent loads latest stock snapshot
   |
   v
RAG + news + Gemini recommendation
```

This keeps the system near real-time while avoiding unnecessary Gemini calls for every small tick.

The technical snapshot includes values such as:

- current price
- previous close
- price change percent
- intraday range
- recent saved-snapshot movement
- average recent price
- trend direction
- volatility level
- volume level

## Infrastructure

Docker Compose starts:

- PostgreSQL with pgvector
- Kafka
- Zookeeper

```text
docker-compose.yml
```

PostgreSQL is exposed on:

```text
localhost:5434
```

Kafka is exposed on:

```text
localhost:19092
```

## Environment Variables

### Stock Service

```text
FINNHUB_API_KEY=your_finnhub_api_key
MARKET_WS_ENABLED=true
MARKET_WS_URL=wss://ws.finnhub.io
MARKET_WS_SYMBOLS=AAPL,MSFT,NVDA,TSLA
MARKET_WS_RECONNECT_DELAY_MS=5000
MARKET_SIGNAL_COOLDOWN_MS=60000
MARKET_SIGNAL_PRICE_CHANGE_THRESHOLD_PERCENT=0.5
KAFKA_BOOTSTRAP_SERVERS=localhost:19092
```

### AI Agent Service

```text
GEMINI_API_KEY=your_gemini_api_key
NEWS_API_KEY=your_news_api_key
DB_URL=jdbc:postgresql://localhost:5434/stock_db
DB_USER=postgres
DB_PASS=12345678
KAFKA_BOOTSTRAP_SERVERS=localhost:19092
```

### Auth Service

```text
KAFKA_BOOTSTRAP_SERVERS=localhost:19092
```

The default database credentials are configured in each service's `application.yaml`.

## Running Locally

Start infrastructure:

```bash
docker compose up -d
```

Run the backend services:

```bash
cd auth-service
mvn spring-boot:run
```

```bash
cd stock-service
mvn spring-boot:run
```

```bash
cd ai-agent-service
mvn spring-boot:run
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server:

```text
http://localhost:5173
```

## Frontend API Proxy

The Vite dev server proxies API calls to the correct backend service:

```text
/api/v1/auth          -> http://localhost:8081
/api/stocks           -> http://localhost:8082
/api/recommendations  -> http://localhost:8083
/api/ai               -> http://localhost:8083
```

## Build Commands

Build frontend:

```bash
cd frontend
npm run build
```

Build stock service:

```bash
cd stock-service
mvn -DskipTests package
```

Build AI agent service:

```bash
cd ai-agent-service
mvn -DskipTests package
```

Build auth service:

```bash
cd auth-service
mvn -DskipTests package
```

## End-To-End Flow

```text
User logs in
   |
   v
Auth Service returns JWT
   |
   v
Stock Service receives live WebSocket trades
   |
   v
Stock Service stores stock snapshots
   |
   v
Stock Service publishes Kafka stock events
   |
   v
AI Agent Service consumes stock events
   |
   v
AI Agent Service retrieves RAG context from pgvector
   |
   v
AI Agent Service calls Gemini with stock data, news, and context
   |
   v
Recommendation is stored
   |
   v
Frontend displays latest recommendations
```

## Notes

- The WebSocket market feed requires a valid provider API key.
- If `FINNHUB_API_KEY` is not set, the stock service will still start, but the live market feed will not connect.
- The AI service requires Gemini and News API keys for full recommendation generation.
- Kafka keeps stock ingestion and AI processing decoupled, so market data can continue flowing even while AI processing happens asynchronously.
