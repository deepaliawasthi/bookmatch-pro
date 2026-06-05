# BookMatch Pro — AI Platform Import Prompt

> Paste this into Bolt (bolt.new) or Lovable to regenerate or extend the UI.

---

## How to use

**Bolt.new:**
1. Go to [bolt.new](https://bolt.new)
2. Paste the prompt below into the chat

**Lovable:**
1. Go to [lovable.dev](https://lovable.dev)
2. Start a new project and paste the prompt below

---

## Prompt

```
Build a mobile web app called BookMatch Pro — a professional book recommendation app that shows a personalized Usefulness Score (0–100) for every book based on the user's job title, industry, and skill gaps.

TECH STACK:
- React 18 + Vite + Tailwind CSS
- React Router v6 for navigation
- All data from fetch() calls to n8n webhook URLs stored in environment variables

DESIGN SYSTEM:
- Primary color: #F97316 (orange) — used for buttons, selected states, scores
- Hero sections: linear-gradient(160deg, #1E3A5F, #0F2344) (dark navy)
- Background: #f9fafb (light gray)
- Cards: white, border-radius 16–24px
- Font: system font stack (-apple-system, BlinkMacSystemFont, Segoe UI)
- Bottom nav: 3 tabs — Home, Library, Profile

SCREENS TO BUILD:

--- SCREEN 1: LOGIN (first screen shown) ---
- Dark navy top section with 📚 logo and "BookMatch Pro" title
- White card slides up from bottom with Log In / Sign Up tabs
- Sign Up is 2 steps:
  Step 1: Full Name, Email, Password
  Step 2 (profession): Job Title (text input), Industry (chip selector: Technology/Marketing/Finance/Healthcare/Education/Sales/Operations/Consulting/Other), Skills (multi-select chips), Reading Goal (radio: Learn skills / Get promoted / Start a business / Stay current), Time Available per day (4 option grid: 15min/30min/1hr/2hr+), Skill Gaps (multi-select chips)
- Orange primary button throughout
- On login/signup success → save user to localStorage as bookroi_user, profile as bookroi_profile → navigate to Home

--- SCREEN 2: HOME ---
Header:
- "BookMatch Pro" title + 🔥 N-day streak badge (orange pill)
- User's job title + industry subtitle
- Profile avatar button (orange circle) → navigates to Profile
- Search bar (gray rounded input)

Category chips (horizontal scroll, orange selected):
All | Business | Leadership | Productivity | Marketing | Finance

Monthly Pick Banner (full width, dark navy card):
- "📅 Monthly Pick" orange badge + "🎯 XX/100 match" gold text
- Book cover (left) + title, author, "Matched to your skill gap" text, orange Read button
- Tapping navigates to Book Detail

Personalized section "Matched for [Job Title]s" (horizontal scroll of book cards):
- Each card: book cover with score badge (white circle, green/orange border showing score), title, author

Main book list (vertical rows):
- Each row: book cover (colored bg by category) + title, author, score badge ("87/100 fit" green/orange pill) + orange "Read" button
- Tapping navigates to Book Detail

Bottom navigation: Home (active orange) | Library | Profile

--- SCREEN 3: BOOK DETAIL ---
Hero section (dark navy):
- Back arrow (← white) + bookmark icon (🔖, fills orange when saved)
- Book cover (left, shadow) + Title, Author, Category pill, rating
- Usefulness Score SVG ring (0–100, green ≥80, orange ≥65, gray otherwise) with "Excellent fit" / "Good fit" label
- Orange "Start Reading" full-width button

4-tab navigation (sticky, orange underline active):
Overview | Micro-Read | Actions | Reviews

OVERVIEW TAB:
- Usefulness Score card with ring + "Scored for [Job Title]s" label
- Top 3 Takeaways: numbered orange circles with takeaway text on orange-50 bg
- Chapter Guide card (blue-50 bg): which chapters = 80% value, time estimate
- "Short on time?" card (green-50 bg): alternative shorter book suggestion

MICRO-READ TAB:
- Progress bar (orange fill)
- List of 5–10 min reading sessions, each showing: time badge, title, objective, key insight
- Checkmark button to mark done (green when done)
- Stores progress in localStorage keyed to book Work_ID

ACTIONS TAB:
- Impact counter row: Tried / Worked / Success %
- Action challenge cards: chapter badge (purple), difficulty (Easy/Medium/Hard colored), time, challenge text
- 3 buttons per challenge: "✅ It worked!" (green) / "Tried it" (orange) / "Skip" (gray)
- After logging, shows result with undo option
- Stores outcomes in localStorage

REVIEWS TAB:
- Filter buttons: "All Reviews" / "My Role" (filters by matching jobTitle/industry)
- Review cards: job title + industry header, star rating (orange), quote text, time spent
- "✍️ Write a Review" button → expands inline form with star rating selector, textarea, submit

--- SCREEN 4: LIBRARY ---
Header: "My Library" + stats (X saved · Y badges)

3 tabs: Saved | Badges | Impact

SAVED TAB: List of saved books with cover, title, author, score badge, chevron

BADGES TAB:
- Streak card (dark navy, 🔥 N-day streak)
- "EARNED" section: 3-col grid of badge cards (orange bg, emoji, name, "Earned" pill)
- "LOCKED" section: same grid, grayed out 50% opacity
Badges: 📖 First Chapter | 🔥 3-Day Streak | ⚡ Week Warrior | 🏆 Monthly Master | 🎯 Action Taker | 💡 Tactic Expert | 💬 Community Voice | 🧠 Deep Reader | ⏱️ Productivity Pro | 👑 Leadership Maven

IMPACT TAB:
- 2×2 stat grid: Tactics Applied (orange) / Books Saved (blue) / Reviews Written (purple) / Day Streak (green)
- "Great work!" card if tactics > 0
- Milestone progress bars: 3-day streak / Apply 5 tactics / Save 3 books

--- SCREEN 5: PROFILE SETUP ---
Dark navy header with back arrow + "Log out" button (orange text pill)
Title "My Profile" + subtitle

White cards with rounded corners for each section:
- Email (text input)
- Job Title (text input)  
- Industry (chip selector, orange selected)
- Skills (chip multi-select, orange selected)
- Reading Goal (radio chips)
- Time Available (2×2 grid of option cards, orange border when selected)

Orange "Save & See My Books →" button

STATE MANAGEMENT:
- Auth: localStorage.bookroi_user = {name, email}
- Profile: localStorage.bookroi_profile = {jobTitle, industry, skills, readingGoal, timeAvailable, skillGaps}
- Saved books: localStorage.bookroi_saved = []
- Streak: localStorage.bookroi_streak = {count, lastDate}
- Impact: localStorage.bookroi_impact = {tacticsApplied, reviews, saved, microCompleted}
- Micro-read progress: localStorage.micro_{Work_ID} = [completedIds]
- Action outcomes: localStorage.actions_{Work_ID} = {challengeId: outcome}

API CALLS (all fallback to placeholder data if env vars not set):
- GET /books?category=X → returns book array
- GET /book?id=X → returns book with reviews array
- GET /recommendations?jobTitle=X&industry=X → returns book array
- POST /profile with body {email, name, jobTitle, industry, skills, readingGoal, timeAvailable, skillGaps}
- POST /review with body {bookId, userEmail, roiScore, timeSpent, keyTakeaway, appliedAtWork}

USEFULNESS SCORE CALCULATION (client-side):
Base 52 + 18 if book category matches industry mapping + 14 if category matches reading goal + 9 if skills overlap + deterministic variation (0–6 based on Work_ID hash). Capped 42–99.

The app should work completely with placeholder data when API env vars are not set.
```
