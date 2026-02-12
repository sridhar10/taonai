# 1Recruit - Sourcing Agent Orchestrator

## Problem Statement
Create a UI mockup for a sourcing agent orchestrator with job listings, pipeline management, and multi-channel candidate outreach.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB (mock data for MVP)
- **Routing**: /jobs (listing), /jobs/:id (details + pipeline + sourcing)

## User Personas
- HR Recruiters
- Talent Acquisition Teams
- Hiring Managers

## Core Requirements
- Job listing page with tech roles
- Pipeline visualization (Sourcing → Screening → Interview → Offer → Joined)
- Sourcing sub-workflow with tabs (Talent Match, Syndication, Auto Sourcing, Consolidated)
- Candidate table with multiselect
- Multi-channel outreach (WhatsApp, Email, LinkedIn InMail)
- Chat co-pilot sidebar
- Collapsible sidebar navigation

## What's Been Implemented (Feb 2026)
- [x] Job listing page with 5 tech jobs (Bengaluru/Hyderabad)
- [x] Job details with pipeline stepper
- [x] Sourcing workflow with 4 tabs + table view
- [x] Candidate multiselect + bulk actions
- [x] Outreach dialog: channel selection → message builder → send confirmation
- [x] Message templates with job details, company, location, notice period, apply link
- [x] Persistent chat co-pilot sidebar
- [x] Collapsible sidebar (collapsed by default)
- [x] 1Recruit branding with custom logo

## Prioritized Backlog
- P0: Wire chat co-pilot to real LLM
- P1: Build Screening/Interview/Offer/Joined pipeline stages
- P1: Candidate detail modal with full profile
- P2: Drag-and-drop between pipeline stages
- P2: Real-time notification system
- P3: Analytics dashboard
