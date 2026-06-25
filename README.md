# SmartInvest — Premium AI Investment Research Agent

SmartInvest is a hiring-quality, full-stack Next.js application that automates deep investment research for public companies. Powered by a multi-agent **LangGraph.js** workflow, the application searches the web, analyzes stock valuation ratios from Yahoo Finance, extracts media sentiment from recent news, compiles risk factors, and issues an **INVEST** or **PASS** recommendation complete with an explainable AI breakdown, scorecards, charts, and a printable PDF report.

---

## 🚀 Key Features

* **Multi-Agent Orchestration**: Sequential multi-agent pipeline built with LangGraph.js and TypeScript.
* **Yahoo Finance Integration**: Retrieves real-time trading statistics, price multiples, balance sheet liquidity, and multi-year revenue histories.
* **Tavily Web Search**: Scrapes real-time web content and citations for news, business quality, and market risks.
* **Premium Dashboard UI**: Dark mode dashboard featuring glassmorphic components, interactive charting (Recharts), and smooth CSS micro-animations.
* **Peer Comparison Matrix**: Compare saved companies side-by-side on financials, scores, and historical trajectories.
* **Explainable AI (XAI)**: Attribute scores directly to qualitative breakdowns (Moat depth, Balance sheet strength, Growth vectors).
* **Execution Logs Visualizer**: A custom terminal logs parser showing the step-by-step pipeline execution in real-time.
* **PDF Exporter**: Single-click high-density multi-page PDF generation of research reports.
* **Confetti Celebration**: Celebrates bullish `INVEST` decisions with interactive particle bursts.

---

## 📐 Multi-Agent Architecture

The analysis is structured as a linear state graph where each agent node appends its gathered signals, URLs, and console traces to the annotation state.

```
                   ┌───────────────────────┐
                   │         START         │
                   └───────────┬───────────┘
                               │
                    [ Initiates pipeline ]
                               ▼
                   ┌───────────────────────┐
                   │    Research Agent     │ ◄─── (Tavily search for overview,
                   └───────────┬───────────┘       industry, and leadership)
                               │
                    [ Gathers corporate profiles ]
                               ▼
                   ┌───────────────────────┐
                   │    Financial Agent    │ ◄─── (Resolves ticker & queries
                   └───────────┬───────────┘       Yahoo Finance APIs)
                               │
                    [ Resolves valuation ratios ]
                               ▼
                   ┌───────────────────────┐
                   │      News Agent       │ ◄─── (Extracts recent articles and
                   └───────────┬───────────┘       classifies media sentiment)
                               │
                    [ Scores sentiment balance ]
                               ▼
                   ┌───────────────────────┐
                   │      Risk Agent       │ ◄─── (Identifies regulatory, debt,
                   └───────────┬───────────┘       and competitor headwinds)
                               │
                    [ Compiles risk indicators ]
                               ▼
                   ┌───────────────────────┐
                   │    Decision Agent     │ ◄─── (Llama 3.3 70B compiles
                   └───────────┬───────────┘       thesis, scores, & recommendations)
                               │
                    [ Emits structured JSON payload ]
                               ▼
                   ┌───────────────────────┐
                   │          END          │
                   └───────────────────────┘
```

### Node Responsibilities
1. **Research Agent**: Collects sector classifications, business summaries, primary products, and leadership.
2. **Financial Agent**: Resolves company name to ticker symbol and extracts trading ratios (P/E, P/S, ROE, FCF).
3. **News Agent**: Sources news articles and runs sentiment classifiers (positive, neutral, negative).
4. **Risk Agent**: Maps liabilities across competitive, regulatory, macroeconomic, and balance-sheet sectors.
5. **Decision Agent**: Consolidates findings and issues the final recommendation and confidence rating using Llama 3.3 70B on Groq.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS (v4), Recharts, Lucide Icons, html2canvas, jsPDF, canvas-confetti.
* **Agent Engine**: LangGraph.js, LangChain.js.
* **LLM Engine**: Groq API (Llama 3.3 70B model: `llama-3.3-70b-versatile`).
* **Financial Data**: Yahoo Finance API via `yahoo-finance2`.
* **Search Provider**: Tavily Search REST API.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Groq API Key (Required for LLM Decisions)
GROQ_API_KEY=gsk_...

# Tavily API Key (Required for Web Search nodes)
TAVILY_API_KEY=tvly-...
```

---

## 💻 Local Setup & Execution

### 1. Clone & Install
```bash
# Navigate to project
cd SmartInvest

# Install dependencies
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🚀 Deployment Steps (Vercel)

The codebase is fully configured for zero-configuration deployments on Vercel:

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to the [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Select your repository.
4. Expand **Environment Variables** and add:
   * `GROQ_API_KEY`
   * `TAVILY_API_KEY`
5. Click **Deploy**. Vercel will automatically detect Next.js, compile the production bundles, and assign a SSL domain.

---

## 📈 Example Response Format (API Output)

`POST /api/analyze`
```json
{
  "company": "Tesla",
  "ticker": "TSLA",
  "recommendation": "INVEST",
  "confidenceScore": 88,
  "financialScore": 78,
  "growthScore": 92,
  "riskScore": 72,
  "finalScore": 81,
  "reasoning": "Tesla exhibits a strong market presence...",
  "strengths": [
    "Industry-leading margins in electric vehicles.",
    "Massive cash reserve ($30B+)."
  ],
  "risks": [
    "Intensifying competition from BYD."
  ],
  "financialData": {
    "ticker": "TSLA",
    "marketCap": 785000000000,
    "peRatio": 56.4
  },
  "news": [
    {
      "title": "Tesla Full Self-Driving milestone",
      "url": "https://...",
      "source": "Bloomberg",
      "sentiment": "positive"
    }
  ],
  "explainableReasoning": {
    "businessQuality": "High-quality disruptive ecosystem...",
    "financialStrength": "Pristine balance sheet...",
    "competitiveAdvantage": "Extensive Supercharger footprint...",
    "growthPotential": "Robotaxi scaling...",
    "riskAnalysis": "Chinese EV price pressure..."
  },
  "citations": ["https://ir.tesla.com"]
}
```

---

## 🧠 Design Decisions & Trade-offs

1. **Groq via Openai Adapter**: We chose to implement Groq connection via `@langchain/openai` configuration instead of the separate `@langchain/groq` package to bypass potential peer-dependency bugs with React 19/Next 15 and ensure robust connection scaling.
2. **Robust Ticker Resolution**: In financial markets, users search for company names rather than stock tickers. We created a custom ticker resolver that searches Yahoo Finance and falls back on common ticker dictionaries to ensure financial reporting works reliably.
3. **HTML Canvas PDF Exports**: We dynamically load `html2canvas` and `jspdf` on the client side, allowing seamless capturing of charts and styling while protecting against SSR build errors.
4. **Mock Demo Runs**: The application includes high-quality pre-loaded research runs (Tesla and Nvidia) so the product is fully explorable and functional immediately upon loading, even without configuring API keys.
5. **Array Reducers in LangGraph State**: Using state reducers for `logs` and `citations` allows individual agents to run asynchronously or sequentially and append data to shared lists rather than overwriting existing records.
