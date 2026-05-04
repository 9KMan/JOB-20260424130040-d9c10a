# Content Factory

AI-Powered Content Automation System for creators.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.0 (async)
- **Database**: PostgreSQL 15
- **AI**: OpenAI GPT-4 Turbo

## Quick Start

### Using Docker Compose

```bash
cp .env.example .env
# Edit .env with your API keys
docker-compose up -d
```

### Manual Setup

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Features

- AI Content Generation with 3 variants
- Trend Scanner across platforms
- Creator Instruction Engine
- Analytics Dashboard
- Post Scheduler (Postiz integration)
- n8n Workflow Triggers

## API Documentation

Once running, visit:
- Backend: http://localhost:8000/docs
- Frontend: http://localhost:3000

## Environment Variables

| Variable | Description |
|----------|-------------|
| OPENAI_API_KEY | Your OpenAI API key |
| POSTIZ_TOKEN | Postiz social scheduling token |
| N8N_WEBHOOK_URL | n8n workflow webhook URL |
| DATABASE_URL | PostgreSQL connection string |