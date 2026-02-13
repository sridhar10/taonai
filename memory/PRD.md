# 1Recruit - Sourcing Agent Orchestrator

## Original Problem Statement
Create a UI mockup for a sourcing agent orchestrator called "1Recruit" - a recruitment management platform with job listings, candidate sourcing, and communication tracking.

## Core Requirements

### Job Listing Page
- Display 5 mock tech job roles in Bengaluru and Hyderabad
- Cards showing job title, location, experience, skills, pipeline count, openings

### Job Details Page
- Pipeline stages: Sourcing, Screening, Interview, Offer, Joined
- Detailed sourcing workflow with Candidates and Communications tabs

### Sourcing Workflow - Candidates Section
- Table with: Candidate Name, Current Role, Years of Experience, Source (with icons), Match Score, Match Reason, Actions
- Expandable Match Reason accordion
- "Refine & Source" CTA triggering chat-based workflow
- Filters for Match Score and Source Type
- Bulk selection and messaging

### Sourcing Workflow - Communications Section
- Table showing all messages sent to candidates
- Columns: Candidate Name, Channel (icon), Message Type, Date, Message, Status
- Expandable rows showing full message and response details
- "Set Rules" CTA for automation rule management

### Chat Interface
- Persistent right-side chat panel
- Outreach flow for sending messages (WhatsApp, Email, LinkedIn)
- Refined Search flow for custom sourcing criteria
- Rules Engine flow for automation management

### General UI
- "1Recruit" branding with logo
- Collapsible sidebar (collapsed by default)
- No authentication required
- Modern, clean, corporate SaaS look

## Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, Shadcn UI
- **Backend**: FastAPI (Python) - mock data only
- **Data**: Mock data in JavaScript file

## Architecture
```
/app
├── backend/
│   ├── server.py           # FastAPI mock endpoints
│   └── requirements.txt
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/     # DashboardLayout, Sidebar, ChatPanel
        │   ├── sourcing/   # CandidateTable, CommunicationsTable
        │   └── ui/         # Shadcn components
        ├── pages/          # JobsListPage, JobDetailsPage
        └── data/           # mockData.js
```

## What's Been Implemented ✅

### December 2025
- [x] Job listing page with 5 mock jobs
- [x] Job details page with pipeline stepper
- [x] Candidates table with filtering, search, bulk actions
- [x] Communications table with expandable rows
- [x] Chat-based outreach workflow
- [x] Refined search chat flow
- [x] Rules engine chat flow
- [x] Collapsible sidebar (collapsed by default)
- [x] 1Recruit branding integration
- [x] **Fixed**: Communications table column layout bug (columns now properly spaced)

## API Endpoints
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{job_id}` - Get job details
- `GET /api/jobs/{job_id}/candidates` - Get candidates for job

## Known Issues
- None currently

## Future Enhancements (Backlog)
- Add actual backend integration
- User authentication
- Real-time messaging
- Calendar integration for interviews
- Analytics dashboard
