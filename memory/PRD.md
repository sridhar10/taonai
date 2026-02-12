# 1Recruit - Sourcing Agent Orchestrator

## Problem Statement
Create a UI mockup for a sourcing agent orchestrator with job listings, pipeline management, multi-channel candidate outreach via chat, and AI-guided refined search.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB (mock data for MVP)
- **Routing**: /jobs (listing), /jobs/:id (details + pipeline + sourcing)

## User Personas
- HR Recruiters, Talent Acquisition Teams, Hiring Managers

## What's Been Implemented (Feb 2026)
- [x] Job listing page with 5 tech jobs (Bengaluru/Hyderabad)
- [x] Job details with 5-stage pipeline stepper
- [x] Sourcing workflow with 4 tabs (Talent Match, Syndication, Auto Sourcing, Consolidated)
- [x] Table-based candidate view with multiselect
- [x] **Chat-based outreach flow** (replaced dialog): channel selection → draft message → confirm/edit → send
- [x] **Refine & Source CTA**: guided Q&A in chat (must-have skills, exclusions, company prefs, source selection)
- [x] Per-tab searching indicators with animated spinners
- [x] Collapsible sidebar (collapsed by default) with 1Recruit branding
- [x] Persistent chat co-pilot sidebar with mode badges (Outreach / Refine Search)

## Prioritized Backlog
- P0: Wire chat co-pilot to real LLM for intelligent conversations
- P1: Build Screening/Interview/Offer/Joined pipeline stages
- P1: Candidate detail modal with full profile
- P2: Drag-and-drop between pipeline stages
- P2: Real outreach integration (email/WhatsApp/LinkedIn APIs)
- P3: Analytics dashboard with outreach metrics
