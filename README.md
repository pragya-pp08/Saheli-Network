# 🌸 Saheli Network

### *Every woman's skill, found by her community.*

---

Okay so here's the thing. There are millions of women across small towns and villages in India who can stitch a blouse perfectly, who give the best mehndi in the mohalla, who've been cooking for functions for 15 years — and almost none of them have a way to turn that into a steady income. Not because the demand isn't there. It is. Someone three streets away is *right now* looking for a tailor. They just have no way of finding each other.

That's the gap we're trying to close.

Saheli Network is a hyperlocal platform that connects skilled women to real, local work — and uses AI to do the matchmaking, the trust-building, and even the business advice that usually only comes from years of experience (or a really good chacha in the business).

---

## 📍 Current Status (Being Upfront)

- ✅ Frontend UI — Dashboard, Orders, Earnings, Opportunities, Profile, all built and working
- ✅ Saheli ki Salah page — UI built, currently shows **mock/sample responses** (not live AI yet)
- ⏳ Backend (FastAPI) — in progress
- ⏳ Claude API integration for live AI advisor & matching — planned next
- ⏳ AI Demand Engine, Trust Passport, Crisis Recovery — designed, not yet implemented

We'd rather tell you this upfront than have you click something mid-demo expecting it to be live.

---

## 🧵 The Problem, Honestly

- Skilled women exist. Local demand for their skills exists. **The connection doesn't.**
- Most gig/job platforms assume English literacy, smartphone fluency, and urban density. That excludes exactly the women who need this most.
- Trust is the real currency in hyperlocal services — and no app has actually figured out how to build it without faking it with star ratings.
- Women going through sudden financial hardship (loss of a earning family member, etc.) have *zero* structured way to quickly start earning again.

We didn't want to build "another job board." We wanted to build the infrastructure that's actually missing.

---

## ✨ What We Built

| Feature | What it does |
|---|---|
| 🎙️ **Voice-first onboarding** | Register and list your skills by speaking, in your local language. No forms, no English requirement. |
| 📋 **Community Need Board** | Locals post what they need — tailoring, tuition, cooking, childcare — in plain language. |
| 🧠 **AI Demand Engine** | The actual brain of the project. It reads local requests and figures out *what's needed where*, instead of waiting for someone to search. |
| 🎟️ **Trust Passport** | A profile built on verified work history and community endorsements — not gameable star ratings. |
| 💬 **Saheli ki Salah** *(AI Advisor)* | Personalized business coaching — pricing tips, seasonal demand alerts, growth suggestions. UI is built; responses are currently mocked while the AI backend is wired up. |
| 🚨 **Crisis Recovery Mode** | For women facing sudden financial hardship — generates an immediate, personalized roadmap to start earning fast. |
| 📊 **Dashboard** | Earnings, orders, repeat clients, growth trends — all in one place. |

---

## 🛠️ Built With

- **React + Vite** — fast, lightweight frontend
- **Tailwind CSS** — for that clean, warm UI (we wanted it to feel human, not corporate)
- **FastAPI** *(planned/in progress)* — backend for matching logic and APIs
- **Claude API** *(planned/in progress)* — powering Saheli ki Salah's advisory responses

> 🚧 Heads up: the AI advisor and backend matching are actively being built out. What you're seeing in this repo right now is the full frontend experience — Dashboard, Orders, Earnings, Opportunities, Profile, and the Salah page — wired up and ready for the AI layer to plug in.

---

## 📁 What's Inside

```
src/
├── components/
│   ├── LotusLogo.jsx
│   └── Sidebar.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── EarningsPage.jsx
│   ├── OpportunitiesPage.jsx
│   ├── OrdersPage.jsx
│   ├── ProfilePage.jsx
│   ├── SalahPage.jsx        ← Saheli ki Salah (AI advisor)
│   └── Placeholders.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🚀 Running It Locally

```bash
git clone https://github.com/pragya-pp08/Saheli-Network.git
cd Saheli-Network
npm install
npm run dev
```

That's it. Should be live on `localhost:5173`.

---

## 💭 Why This, Why Now

We didn't want to build a tool that *sounds* impactful in a pitch deck and then quietly assumes everyone using it has a smartphone, speaks English, and trusts strangers off an app. We wanted something that actually starts from where these women already are — their skills, their community, their language — and builds the missing pieces around that.

This is a hackathon project, so it's not finished. But the bones are real, and we think the idea holds up.

---

## 🙋‍♀️ Built By

**Pragya Richa Pandey** — [@pragya-pp08](https://github.com/pragya-pp08)

If you're a judge, mentor, or just someone who stumbled on this repo — thank you for reading this far. Feedback's always welcome. 🌸
