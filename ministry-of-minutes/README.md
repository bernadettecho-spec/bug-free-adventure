# Ministry of Minutes

Secretariat workflow automation for Singapore Government meetings. Automates agenda circulation, transcript review, and minutes distribution for the Singapore Public Service.

## Features

- **Stage 1 — Agenda Setup & Circulation:** Configure meeting details, manage attendees (CSV upload or manual), build agenda items, preview formatted agenda, and circulate via Opus email trigger + direct attendee email
- **Stage 2 — Transcript Review:** Upload `.txt`/`.vtt` transcripts, AI-powered summarisation (Claude), inline-editable key decisions, action items, and follow-up items
- **Stage 3 — Minutes Distribution:** Pre-populated minutes editor, action items table, generate `.docx` minutes, circulate via Opus email trigger + direct attendee email

## Prerequisites

- Node.js 18+
- SQLite3 (bundled via `better-sqlite3`)
- SMTP credentials from your organisation
- Anthropic API key (for AI summarisation)

## Local Development Setup

```bash
# 1. Clone the repository and enter the project directory
cd ministry-of-minutes

# 2. Install root dependencies (server)
npm install

# 3. Install client dependencies
cd client && npm install && cd ..

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)

# 5. Start both servers concurrently
npm run dev
```

The app will be available at `http://localhost:5173` (Vite dev server proxies API calls to `http://localhost:3000`).

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `SMTP_HOST` | Your organisation's SMTP server hostname |
| `SMTP_PORT` | SMTP port (typically 587 for TLS) |
| `SMTP_USER` | SMTP authentication username |
| `SMTP_PASS` | SMTP authentication password |
| `SMTP_FROM` | From address for outgoing emails |
| `OPUS_AGENDA_TRIGGER_EMAIL` | Opus workflow trigger address for agenda emails |
| `OPUS_MINUTES_TRIGGER_EMAIL` | Opus workflow trigger address for minutes emails |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude AI summarisation |
| `PORT` | Server port (default: 3000) |

## Opus Setup Guide

Ministry of Minutes triggers Opus workflows by **sending emails to Opus-provisioned trigger addresses**. Opus is not called via REST API — it works in reverse: our app sends an email *to* Opus, which parses it and passes the content to downstream workflow nodes.

### Steps

1. Log into the Opus platform (see your agency's Opus documentation or visit `https://docs.developer.tech.gov.sg/docs/opus-documentation`)
2. Create **two workflows**: one called "Agenda Circulation" and one called "Minutes Distribution"
3. Add an **Email Trigger Node** as the entry point of each workflow
4. Open each trigger node's Settings → **Setup** tab:
   - Copy the **Staging Email Address** (format: `default-staging+...@ci.opus`) for testing
   - Copy the **Production Email Address** for go-live
5. Paste into `.env`:
   ```
   OPUS_AGENDA_TRIGGER_EMAIL=default-staging+<your-agenda-workflow-address>@ci.opus
   OPUS_MINUTES_TRIGGER_EMAIL=default-staging+<your-minutes-workflow-address>@ci.opus
   ```
6. **Publish** each workflow in Opus to activate the trigger
7. Test by clicking "Circulate Agenda" in Ministry of Minutes — Opus should receive the email

### What Opus Receives

**Agenda trigger email:**
- Subject: `[AGENDA] {Meeting Title} — {YYYY-MM-DD}`
- Body: Plain text agenda
- Attachment: `agenda_{Title}_{Date}.html` — GovTech-branded HTML agenda

Downstream Opus nodes can access via: `{{{ data.email.subject }}}`, `{{{ data.email.text }}}`, `{{{ data.email.attachments.[0].base64Content }}}`

**Minutes trigger email:**
- Subject: `[MINUTES] {Meeting Title} — {YYYY-MM-DD}`
- Body: Plain text action items summary
- Attachment: `Minutes_{Title}_{YYYYMMDD}.docx` (base64-encoded)

## Genspark Integration Guide

### Current State (v1)

Manual upload of `.txt` or `.vtt` transcript files is the default mode.

### Webhook Endpoint (scaffold)

A scaffold webhook endpoint is available at:

```
POST /api/webhook/genspark
```

**Expected payload:**

```json
{
  "meeting_id": 1,
  "transcript": "Full transcript text content",
  "speakers": [
    {
      "name": "Speaker Name",
      "segments": [
        { "start": 0, "end": 120, "text": "..." }
      ]
    }
  ],
  "format": "txt"
}
```

**To switch from manual upload to Genspark webhook:**

1. Configure Genspark to POST to your deployed app's `/api/webhook/genspark` endpoint
2. Include the correct `meeting_id` from Ministry of Minutes
3. The transcript will be stored automatically and appear in Stage 2

## CSV Format for Standing Members

Upload a CSV file with these exact column headers (case-insensitive):

```
Name,Email,Role,Ministry
Alice Tan,alice.tan@mom.gov.sg,Director,Ministry of Manpower
Bob Lim,bob.lim@moe.gov.sg,Deputy Director,Ministry of Education
```

Standing members are shown with a **Cyan** badge. Ad-hoc presenters added manually are shown with a **Magenta** badge.

## Rabbit Deploy Steps

Ministry of Minutes is configured for deployment on Rabbit Deploy (GCC-hosted GitLab CI/CD).

1. Push your code to the GitLab `main` branch
2. The `.gitlab-ci.yml` pipeline automatically runs:
   - **Build stage:** Installs dependencies, builds the React client, copies `dist/` to `server/public/`
   - **Deploy stage:** Rabbit Deploy picks up build artifacts via GitLab integration
3. Monitor deployment via the **Build Log Viewer** and **Server Log Viewer** in the Rabbit Deploy dashboard
4. Set environment variables in Rabbit Deploy's environment configuration panel (do not commit `.env` to git)

### Manual Package (for ZIP deployment)

```bash
npm run package
```

This creates `ministry-of-minutes.zip` (excludes `node_modules`, `.env`, `.git`).

## Project Structure

```
ministry-of-minutes/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   ├── PipelineProgress.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Stage1_Agenda/
│   │   │   ├── Stage2_Transcript/
│   │   │   └── Stage3_Minutes/
│   │   ├── styles/
│   │   │   └── govtech-tokens.css
│   │   └── App.jsx
│   └── package.json
├── server/                          # Express backend
│   ├── routes/
│   │   ├── meetings.js
│   │   ├── email.js
│   │   ├── transcript.js
│   │   └── minutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── adapters/
│   │   └── TranscriptAdapter.js
│   ├── db/
│   │   ├── schema.sql
│   │   └── db.js
│   └── index.js
├── .env.example
├── .gitlab-ci.yml
├── Procfile
└── package.json
```

## Out of Scope (v1)

- Authentication / user login (trusted internal network assumed)
- Calendar integration (manual date entry only)
- Real-time collaborative editing
- Genspark direct API integration (webhook scaffolded, not wired)
- Opus downstream workflow logic (configured by Opus team separately)
