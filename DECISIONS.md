SmartInvest — Design Decisions

1. Why this approach over the obvious alternative?

I chose **Part 2: The Premium Home Page** and built the SmartInvest experience around an existing full-stack investment research product rather than creating a purely visual landing page with invented product claims. The goal was to show the actual product instead of only describing it.

The frontend uses **Next.js and TypeScript** with a dark, dashboard-focused interface. The product experience combines a research input, financial analysis, news sentiment, risk analysis, scoring, explainable AI, charts, and PDF reporting. The backend supports a multi-agent LangGraph workflow that coordinates research tasks and produces the final investment analysis.

I preferred showing real product workflows and generated research output over adding fabricated testimonials, customer counts, or company logos. This keeps the page aligned with the assignment's emphasis on honest product presentation.

2. One trade-off you made under the time limit, and what you’d do with a real week

I prioritized **the core research experience, dashboard UI, responsive layout, and product interactions** instead of adding a large number of animations and marketing sections.

The existing product already contains several complex features, including multi-agent execution, financial data retrieval, web research, explainable scoring, charts, and PDF generation. Adding too many visual effects could have made the interface feel less professional and distracted from the product.

With a full additional week, I would improve accessibility testing, add more detailed responsive states, refine loading/error states, and further polish the landing-page storytelling and micro-interactions.

3. Where did you use AI tools, and what did you personally verify or change afterward?

I used AI tools as development assistance for brainstorming, code structure, UI ideas, debugging, and improving parts of the implementation. AI was not treated as a replacement for understanding the application.

I personally reviewed and tested the generated code, checked the frontend behaviour, verified the product flow, and modified implementation details where necessary. I also made sure that the final architecture and product features are understandable enough to explain during a technical follow-up discussion.

The main principle was to use AI to accelerate development while retaining ownership of the final engineering decisions.
