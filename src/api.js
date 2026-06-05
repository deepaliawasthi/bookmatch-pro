// ─── n8n Webhook URLs (set in .env on Day 4) ──────────────────────────────────
const URLS = {
  books:           import.meta.env.VITE_N8N_GET_BOOKS,
  book:            import.meta.env.VITE_N8N_GET_BOOK,
  profile:         import.meta.env.VITE_N8N_POST_PROFILE,
  review:          import.meta.env.VITE_N8N_POST_REVIEW,
  recommendations: import.meta.env.VITE_N8N_GET_RECOMMENDATIONS,
}

// ─── Placeholder books ────────────────────────────────────────────────────────
export const PLACEHOLDER_BOOKS = [
  { Work_ID: '/works/OL1', Title: 'Atomic Habits', Author: 'James Clear', Category: 'productivity', Cover_URL: 'https://covers.openlibrary.org/b/id/10527843-M.jpg', avgROI: 4.8, Page_Count: 320 },
  { Work_ID: '/works/OL2', Title: 'Good to Great', Author: 'Jim Collins', Category: 'business', Cover_URL: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', avgROI: 4.5, Page_Count: 300 },
  { Work_ID: '/works/OL3', Title: 'The Lean Startup', Author: 'Eric Ries', Category: 'business', Cover_URL: 'https://covers.openlibrary.org/b/id/8587643-M.jpg', avgROI: 4.3, Page_Count: 280 },
  { Work_ID: '/works/OL4', Title: 'Leaders Eat Last', Author: 'Simon Sinek', Category: 'leadership', Cover_URL: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', avgROI: 4.1, Page_Count: 256 },
  { Work_ID: '/works/OL5', Title: 'Deep Work', Author: 'Cal Newport', Category: 'productivity', Cover_URL: 'https://covers.openlibrary.org/b/id/10527843-M.jpg', avgROI: 4.7, Page_Count: 296 },
  { Work_ID: '/works/OL6', Title: 'Never Split the Difference', Author: 'Chris Voss', Category: 'negotiation', Cover_URL: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', avgROI: 4.6, Page_Count: 288 },
  { Work_ID: '/works/OL7', Title: 'Influence', Author: 'Robert Cialdini', Category: 'marketing', Cover_URL: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', avgROI: 4.4, Page_Count: 336 },
  { Work_ID: '/works/OL8', Title: 'The Hard Thing About Hard Things', Author: 'Ben Horowitz', Category: 'business', Cover_URL: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', avgROI: 4.5, Page_Count: 304 },
]

// ─── Action challenges per category ──────────────────────────────────────────
const ACTION_CHALLENGES = {
  productivity: [
    { id: 'p1', chapter: 'Chapter 1', challenge: 'Identify one bad habit and its cue, routine, reward today', difficulty: 'Easy', time: '10 min' },
    { id: 'p2', chapter: 'Chapter 3', challenge: 'Stack one new habit onto an existing morning routine', difficulty: 'Medium', time: '15 min' },
    { id: 'p3', chapter: 'Chapter 5', challenge: 'Design your environment to make one good habit obvious', difficulty: 'Medium', time: '20 min' },
  ],
  leadership: [
    { id: 'l1', chapter: 'Chapter 2', challenge: 'Give specific, behaviour-based positive feedback to one person today', difficulty: 'Easy', time: '5 min' },
    { id: 'l2', chapter: 'Chapter 4', challenge: 'Run your next 1:1 by asking "What obstacles can I remove for you?"', difficulty: 'Medium', time: '30 min' },
  ],
  business: [
    { id: 'b1', chapter: 'Chapter 1', challenge: 'List your top 3 competitors and one thing each does better than you', difficulty: 'Easy', time: '15 min' },
    { id: 'b2', chapter: 'Chapter 3', challenge: 'Identify one "stop doing" item that frees up 2+ hours per week', difficulty: 'Hard', time: '1 hr' },
  ],
  marketing: [
    { id: 'm1', chapter: 'Chapter 2', challenge: 'Rewrite one email subject line using a curiosity gap', difficulty: 'Easy', time: '10 min' },
    { id: 'm2', chapter: 'Chapter 4', challenge: 'Audit your homepage CTA — does it trigger reciprocity or social proof?', difficulty: 'Medium', time: '30 min' },
  ],
  finance: [
    { id: 'f1', chapter: 'Chapter 1', challenge: 'Calculate your personal hourly rate and audit 3 tasks you should delegate', difficulty: 'Medium', time: '20 min' },
  ],
  negotiation: [
    { id: 'n1', chapter: 'Chapter 2', challenge: 'Use tactical empathy in your next difficult conversation — label their emotion first', difficulty: 'Medium', time: '15 min' },
    { id: 'n2', chapter: 'Chapter 5', challenge: 'Try the "accusation audit" before your next negotiation or hard meeting', difficulty: 'Hard', time: '20 min' },
  ],
}

// ─── Micro-reading chapters ────────────────────────────────────────────────────
const MICRO_CHAPTERS = {
  productivity: [
    { id: 1, title: 'The Surprising Power of Tiny Changes', minutes: 8, objective: 'Understand why 1% improvements compound dramatically', key: 'Small habits make a big difference over time' },
    { id: 2, title: 'How Habits Shape Your Identity', minutes: 6, objective: 'Shift from goal-based to identity-based habits', key: 'Every action is a vote for the person you want to become' },
    { id: 3, title: 'The 4 Laws of Behaviour Change', minutes: 10, objective: 'Master the framework for building any habit', key: 'Make it obvious, attractive, easy, and satisfying' },
    { id: 4, title: 'The Best Way to Start a New Habit', minutes: 7, objective: 'Use implementation intentions and habit stacking', key: '"When X happens, I will do Y" — specificity triples success rates' },
    { id: 5, title: 'Motivation Is Overrated — Environment Matters More', minutes: 9, objective: 'Design your space to make good habits automatic', key: 'Behaviour is a function of person + environment' },
  ],
  leadership: [
    { id: 1, title: 'Why Leaders Eat Last', minutes: 7, objective: 'Understand the biology of trust and safety', key: 'Great leaders create a Circle of Safety' },
    { id: 2, title: 'Empathy as a Leadership Tool', minutes: 8, objective: 'Use empathy to build high-trust teams', key: 'Empathy is not a soft skill — it drives performance' },
    { id: 3, title: 'The Destructive Abundance of Cortisol', minutes: 6, objective: 'Recognise what destroys psychological safety', key: 'Fear-based leadership produces short-term results, long-term damage' },
  ],
  default: [
    { id: 1, title: 'Core Concepts', minutes: 8, objective: 'Grasp the central idea of this book', key: 'Foundation chapter — read this first' },
    { id: 2, title: 'Applying the Framework', minutes: 10, objective: 'See how the ideas apply to your work', key: 'The most practical chapter in the book' },
    { id: 3, title: 'Common Mistakes', minutes: 6, objective: 'Avoid the pitfalls most people hit', key: 'Saves you from re-learning the hard way' },
  ],
}

// ─── Badges definition ────────────────────────────────────────────────────────
export const ALL_BADGES = [
  { id: 'first_read',     name: 'First Chapter',     icon: '📖', desc: 'Saved your first book',           condition: b => b.saved >= 1 },
  { id: 'streak_3',       name: '3-Day Streak',       icon: '🔥', desc: 'Read 3 days in a row',            condition: b => b.streak >= 3 },
  { id: 'streak_7',       name: 'Week Warrior',       icon: '⚡', desc: 'Read 7 days in a row',            condition: b => b.streak >= 7 },
  { id: 'streak_30',      name: 'Monthly Master',     icon: '🏆', desc: 'Read 30 days in a row',           condition: b => b.streak >= 30 },
  { id: 'action_3',       name: 'Action Taker',       icon: '🎯', desc: 'Applied 3 book tactics at work',  condition: b => b.tacticsApplied >= 3 },
  { id: 'action_10',      name: 'Tactic Expert',      icon: '💡', desc: 'Applied 10 tactics at work',      condition: b => b.tacticsApplied >= 10 },
  { id: 'reviewer',       name: 'Community Voice',    icon: '💬', desc: 'Wrote your first review',          condition: b => b.reviews >= 1 },
  { id: 'deep_reader',    name: 'Deep Reader',        icon: '🧠', desc: 'Completed micro-reading on 5 books', condition: b => b.microCompleted >= 5 },
  { id: 'productivity',   name: 'Productivity Pro',   icon: '⏱️', desc: 'Read 3 productivity books',       condition: b => (b.categoryCounts?.productivity || 0) >= 3 },
  { id: 'leader',         name: 'Leadership Maven',   icon: '👑', desc: 'Read 3 leadership books',          condition: b => (b.categoryCounts?.leadership || 0) >= 3 },
]

// ─── Usefulness Score (client-side, replaced by AI on Day 4) ─────────────────
export function calcUsefulnessScore(book, profile) {
  let score = 52
  if (!profile) return score
  const cat = book.Category?.toLowerCase() || ''
  const industry = profile.industry?.toLowerCase() || ''
  const goal = profile.readingGoal || ''
  const skills = (profile.skills || []).map(s => s.toLowerCase())

  // Industry alignment
  const industryMap = { technology: ['productivity', 'business', 'leadership'], marketing: ['marketing', 'business', 'negotiation'], finance: ['finance', 'business'], healthcare: ['leadership', 'productivity'], education: ['productivity', 'leadership'], sales: ['negotiation', 'marketing', 'business'] }
  if ((industryMap[industry] || []).includes(cat)) score += 18

  // Goal alignment
  const goalMap = { skills: ['productivity', 'leadership'], promotion: ['leadership', 'business', 'negotiation'], startup: ['business', 'finance', 'marketing'], current: ['marketing', 'technology', 'business'] }
  if ((goalMap[goal] || []).includes(cat)) score += 14

  // Skills overlap
  const skillKeywords = skills.join(' ')
  if (skillKeywords.includes(cat) || (cat === 'leadership' && skillKeywords.includes('lead')) || (cat === 'marketing' && skillKeywords.includes('marketing'))) score += 9

  // Deterministic book-specific variation (same book always same score)
  const hash = (book.Work_ID || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  score += hash % 7

  return Math.min(99, Math.max(42, score))
}

// ─── Chapter guide ────────────────────────────────────────────────────────────
export function getChapterGuide(book) {
  const timePerPage = 2 // minutes
  const pages = book.Page_Count || 280
  const totalTime = Math.round(pages * timePerPage / 60 * 10) / 10
  return {
    totalHours: totalTime,
    coreChapters: ['Chapter 1', 'Chapter 3', 'Chapter 6'],
    coreHours: Math.round(totalTime * 0.4 * 10) / 10,
    coreValue: 80,
    alternative: { title: 'The ONE Thing', author: 'Gary Keller', time: '3h', reason: 'Covers the same core ideas in half the time' },
  }
}

// ─── Micro chapters ───────────────────────────────────────────────────────────
export function getMicroChapters(book) {
  const cat = book.Category?.toLowerCase() || 'default'
  return MICRO_CHAPTERS[cat] || MICRO_CHAPTERS.default
}

// ─── Action challenges ────────────────────────────────────────────────────────
export function getActionChallenges(book) {
  const cat = book.Category?.toLowerCase() || 'business'
  return ACTION_CHALLENGES[cat] || ACTION_CHALLENGES.business
}

// ─── Top 3 takeaways ─────────────────────────────────────────────────────────
export function getTakeaways(book, profile) {
  const cat = book.Category?.toLowerCase() || ''
  const role = profile?.jobTitle || 'professionals'
  const takeawaysMap = {
    productivity: [`Build a system of habits that works on autopilot — no willpower needed`, `Your environment shapes your behaviour more than motivation does`, `Identity-based habits ("I am a reader") beat goal-based habits ("I want to read")`],
    leadership: [`Psychological safety is the #1 predictor of high-performing teams`, `Great leaders remove obstacles — they don't just set direction`, `Trust is built in small moments, lost in large ones`],
    business: [`Most great companies win by focusing on what they stop doing`, `Culture beats strategy — but only when the strategy is clear first`, `The flywheel effect: small consistent actions compound into unstoppable momentum`],
    marketing: [`People don't buy products — they buy better versions of themselves`, `Reciprocity, scarcity, and social proof are the three triggers that drive decisions`, `The best marketing makes customers feel understood, not sold to`],
    negotiation: [`Never make the first offer — ask calibrated questions instead`, `Tactical empathy disarms the other party before you even make your case`, `"No" is the start of a negotiation, not the end`],
    finance: [`Your most important financial decision is your savings rate, not your investment returns`, `Compound interest rewards patience — the last 10 years of growth dwarf the first 30`, `Avoid lifestyle inflation — the gap between income and spending is wealth`],
  }
  return (takeawaysMap[cat] || [`Core frameworks directly applicable to ${role}`, `Practical tools you can use in your next meeting`, `Mental models that change how you approach everyday decisions`])
}

// ─── Streak helpers ───────────────────────────────────────────────────────────
export function getStreak() {
  const data = JSON.parse(localStorage.getItem('bookroi_streak') || '{"count":0,"lastDate":""}')
  return data
}
export function updateStreak() {
  const today = new Date().toDateString()
  const data = getStreak()
  if (data.lastDate === today) return data
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const newCount = data.lastDate === yesterday ? data.count + 1 : 1
  const updated = { count: newCount, lastDate: today }
  localStorage.setItem('bookroi_streak', JSON.stringify(updated))
  return updated
}

// ─── Impact stats ─────────────────────────────────────────────────────────────
export function getImpactStats() {
  return JSON.parse(localStorage.getItem('bookroi_impact') || '{"tacticsApplied":0,"reviews":0,"saved":0,"microCompleted":0,"categoryCounts":{}}')
}
export function updateImpact(patch) {
  const current = getImpactStats()
  const updated = { ...current, ...patch }
  localStorage.setItem('bookroi_impact', JSON.stringify(updated))
  return updated
}

// ─── API calls ────────────────────────────────────────────────────────────────
export async function getBooks(category = '') {
  if (!URLS.books) return PLACEHOLDER_BOOKS
  try {
    const url = category ? `${URLS.books}?category=${category}` : URLS.books
    const res = await fetch(url)
    if (!res.ok) throw new Error()
    return await res.json()
  } catch { return PLACEHOLDER_BOOKS }
}

export async function getBook(workId) {
  if (!URLS.book) return { ...PLACEHOLDER_BOOKS[0], reviews: PLACEHOLDER_REVIEWS }
  try {
    const res = await fetch(`${URLS.book}?id=${encodeURIComponent(workId)}`)
    if (!res.ok) throw new Error()
    return await res.json()
  } catch { return { ...PLACEHOLDER_BOOKS[0], reviews: PLACEHOLDER_REVIEWS } }
}

export async function getRecommendations(jobTitle, industry) {
  if (!URLS.recommendations) return PLACEHOLDER_BOOKS.slice(0, 4)
  try {
    const res = await fetch(`${URLS.recommendations}?jobTitle=${encodeURIComponent(jobTitle)}&industry=${encodeURIComponent(industry)}`)
    if (!res.ok) throw new Error()
    return await res.json()
  } catch { return PLACEHOLDER_BOOKS.slice(0, 4) }
}

export async function saveProfile(profile) {
  if (!URLS.profile) { console.log('Profile (placeholder):', profile); return { success: true } }
  const res = await fetch(URLS.profile, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
  return res.json()
}

export async function submitReview(review) {
  if (!URLS.review) { console.log('Review (placeholder):', review); return { success: true } }
  const res = await fetch(URLS.review, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(review) })
  return res.json()
}

// ─── Placeholder reviews ───────────────────────────────────────────────────────
const PLACEHOLDER_REVIEWS = [
  { jobTitle: 'Product Manager', industry: 'Technology', keyTakeaway: 'Habit stacking changed how I onboard new features — works perfectly for sprint rituals', roiScore: 5, timeSpent: 6 },
  { jobTitle: 'Marketing Director', industry: 'Marketing', keyTakeaway: 'Applied the 2-minute rule to email triage — saved 45 mins/day immediately', roiScore: 4, timeSpent: 5 },
  { jobTitle: 'Software Engineer', industry: 'Technology', keyTakeaway: 'Environment design tip helped me stop doom-scrolling and write more code', roiScore: 5, timeSpent: 7 },
  { jobTitle: 'Sales Manager', industry: 'Sales', keyTakeaway: 'Identity-based habits reframed how I coach my team — mindset shift is real', roiScore: 4, timeSpent: 6 },
]
