# BookMatch Pro

> AI-matched books for working professionals. Get a Usefulness Score (0–100) for every book before you read it — matched to your job title, industry, and skill gaps.

## Live Demo
<!-- Add Netlify URL here after deployment -->

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend / API | n8n Cloud (webhook workflows) |
| Database | Google Sheets |
| Book Data | Open Library API |
| Hosting | Netlify (free) |

## Features

- **Usefulness Score (0–100)** — personalized match score for every book based on your role
- **2-step signup** — job title, industry, skills, time available, skill gaps
- **Monthly Pick** — one curated book matched to your skill gap each month
- **Micro-Reading Mode** — books broken into 5–10 min sessions with learning objectives
- **Action Tracker** — apply book tactics at work, log outcomes, track real impact
- **Peer Reviews** — filter reviews by your exact job title and industry
- **Badges & Streaks** — earn badges (Negotiation Expert, Week Warrior, etc.), track reading streaks
- **Library** — saved books, badges earned, impact stats

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- n8n Cloud account
- Google Sheets (as database)

### 1. Clone the repo
```bash
git clone https://github.com/deepaliawasthi/bookmatch-pro.git
cd bookmatch-pro
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

Open `.env` and fill in your n8n webhook URLs:
```env
VITE_N8N_GET_BOOKS=https://your-n8n.app.n8n.cloud/webhook/books
VITE_N8N_GET_BOOK=https://your-n8n.app.n8n.cloud/webhook/book
VITE_N8N_POST_PROFILE=https://your-n8n.app.n8n.cloud/webhook/profile
VITE_N8N_POST_REVIEW=https://your-n8n.app.n8n.cloud/webhook/review
VITE_N8N_GET_RECOMMENDATIONS=https://your-n8n.app.n8n.cloud/webhook/recommendations
```

> If `.env` is not set, the app uses built-in placeholder data so you can run it without a backend.

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production
```bash
npm run build
```
Drag the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop) for instant deployment.

## Project Structure

```
src/
├── api.js              # All n8n webhook calls + placeholder data + helpers
├── App.jsx             # Routing + bottom nav + auth guard
├── index.css           # Tailwind base styles
├── main.jsx            # React entry point
└── pages/
    ├── Login.jsx       # Login + 2-step signup with profession details
    ├── Home.jsx        # Book feed, monthly pick, usefulness scores, streak
    ├── BookDetail.jsx  # 4 tabs: Overview, Micro-Read, Actions, Reviews
    ├── Library.jsx     # Saved books, badges, impact stats
    └── ProfileSetup.jsx # Edit profession details + logout
```

## n8n Workflows

All workflows are in your n8n Cloud workspace:

| Workflow | Purpose |
|---|---|
| Book Importer (Multi-Category) | Daily: fetches 100 books from Open Library → Google Sheets |
| GET /books | Returns books, optionally filtered by category |
| GET /book | Returns single book with its reviews |
| POST /profile | Saves/updates user profile |
| POST /review | Appends review, recalculates avgROI |
| GET /recommendations | Returns books matched to user's industry |

### Setting up n8n workflows
1. Open each workflow in n8n Cloud
2. Click the Google Sheets node → select your BookROI spreadsheet
3. Click the toggle (top right) to **Activate** the workflow

## Google Sheets Structure

**Books tab:** `Work_ID | Title | Author | Category | Summary | Cover_URL | Page_Count | avgROI`

**Users tab:** `Email | Name | Job_Title | Industry | Skills | Reading_Goals | Time_Available | Skill_Gaps`

**Reviews tab:** `User_Email | Book_ISBN | ROI_Score | Time_Spent | Key_Takeaways | Applied_At_Work`

## UI Editing

### Using Bolt or Lovable
See [`IMPORT_PROMPT.md`](./IMPORT_PROMPT.md) for a ready-to-paste prompt that describes the full app for AI-assisted editing.

### Making UI changes locally
1. Edit files in `src/pages/`
2. All styling uses Tailwind CSS utility classes
3. Color system: orange `#F97316` (primary), navy `#1E3A5F` (hero sections)

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-change`
3. Commit: `git commit -m 'Add my change'`
4. Push: `git push origin feature/my-change`
5. Open a Pull Request

## Environment Variables Reference

| Variable | Description |
|---|---|
| `VITE_N8N_GET_BOOKS` | Webhook: fetch book list |
| `VITE_N8N_GET_BOOK` | Webhook: fetch single book + reviews |
| `VITE_N8N_POST_PROFILE` | Webhook: save user profile |
| `VITE_N8N_POST_REVIEW` | Webhook: submit review |
| `VITE_N8N_GET_RECOMMENDATIONS` | Webhook: get personalized recommendations |

> All webhooks accept CORS from any origin (`*`).
