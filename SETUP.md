# ContentForge AI — Setup Guide

## Stack
- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** (CSS-first config)
- **Clerk** — Auth
- **Supabase** — Database + storage
- **Groq** — Free LLM (LLaMA 3.1 70B)
- **Stripe** — Billing
- **Framer Motion + Recharts** — UI animations and charts

---

## 1. Environment Variables

Copy `.env.local` and fill in every key:

### Clerk (https://clerk.com)
1. Create a new app
2. Copy **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. Copy **Secret Key** → `CLERK_SECRET_KEY`
4. In Clerk dashboard → Webhooks → Add endpoint:
   - URL: `https://yourapp.com/api/webhooks/clerk`
   - Events: `user.created`, `user.deleted`
   - Copy signing secret → `CLERK_WEBHOOK_SECRET`

### Supabase (https://supabase.com)
1. Create new project
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
5. Run the SQL migration: paste `supabase/migrations/001_initial.sql` in the SQL editor

### Groq (https://console.groq.com) — FREE
1. Create account → API Keys → Create key
2. Copy → `GROQ_API_KEY`
3. Free tier: 14,400 req/day, 500K tokens/min — plenty for development

### Stripe (https://stripe.com)
1. Create account (test mode)
2. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY`
4. Create a Product → Recurring → $19/month
5. Copy Price ID → `STRIPE_PRO_PRICE_ID`
6. Stripe CLI → `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
7. Copy webhook secret → `STRIPE_WEBHOOK_SECRET`

---

## 2. Database Setup

Run this in the Supabase SQL editor:

```sql
-- File: supabase/migrations/001_initial.sql
-- (paste the entire file contents)
```

---

## 3. Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# (same as .env.local)
```

---

## 5. Groq Models Used

| Agent | Model | Why |
|-------|-------|-----|
| Orchestrator | llama-3.1-70b-versatile | Best planning quality |
| Analyst | llama-3.1-70b-versatile | Deep content understanding |
| Platform Agents (x8) | llama-3.1-70b-versatile | Platform-specific quality |
| Critic | llama3-8b-8192 | Fast, cost-efficient review |
| Voice | llama-3.1-70b-versatile | Style analysis |

---

## 6. Architecture

```
User → /forge (POST) → forge_jobs table → executeForgeJob()
         ↓
    Orchestrator Agent (ReAct)
         ↓
    Content Analyst Agent
         ↓
    8x Platform Agents (Promise.allSettled — parallel)
         ↓
    Critic Agent (per platform, retry if score < 6)
         ↓
    forge_results table → SSE stream → UI
```

---

## 7. Key Files

```
lib/agents/
  orchestrator.ts    — ReAct planning agent
  analyst.ts         — Content extraction
  platforms/         — 8 specialist agents
  critic.ts          — Quality gate
  voice.ts           — Brand voice build + update
  pipeline.ts        — Main execution coordinator

app/api/
  forge/route.ts     — Create job + enforce limits
  forge/[id]/stream  — SSE polling stream
  voice/route.ts     — Build/fetch voice profile
  voice/update/      — Learning from corrections

components/forge/
  ForgePage.tsx      — Main UI
  AgentVisualizer    — Real-time pipeline visualization
  PlatformSelector   — 8-platform grid selector
  ResultCard         — Output display with edit + copy
```
