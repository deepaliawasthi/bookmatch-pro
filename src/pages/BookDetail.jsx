import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getBook, submitReview, calcUsefulnessScore, getChapterGuide, getMicroChapters, getActionChallenges, getTakeaways, updateImpact, getImpactStats, PLACEHOLDER_BOOKS } from '../api'

// ─── Usefulness Score ring ────────────────────────────────────────────────────
function UsefulnessRing({ score }) {
  const r = 26, circ = 2 * Math.PI * r
  const progress = (score / 100) * circ
  const color = score >= 80 ? '#16a34a' : score >= 65 ? '#F97316' : '#6b7280'
  const label = score >= 80 ? 'Excellent fit' : score >= 65 ? 'Good fit' : 'Moderate fit'
  return (
    <div className="flex flex-col items-center">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5" strokeDasharray={`${progress} ${circ}`} strokeLinecap="round" transform="rotate(-90 36 36)" />
        <text x="36" y="33" textAnchor="middle" fontSize="14" fontWeight="800" fill={color}>{score}</text>
        <text x="36" y="44" textAnchor="middle" fontSize="8" fill="#9ca3af">/100</text>
      </svg>
      <span className="text-xs font-bold mt-0.5" style={{ color }}>{label}</span>
    </div>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-gray-100 px-4 sticky top-0 bg-white z-10">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} className="flex-1 py-3 text-xs font-bold transition-colors" style={{ color: active === t ? '#F97316' : '#9ca3af', borderBottom: active === t ? '2px solid #F97316' : '2px solid transparent' }}>
          {t}
        </button>
      ))}
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({ book, profile, score }) {
  const guide = getChapterGuide(book)
  const takeaways = getTakeaways(book, profile)
  return (
    <div className="space-y-4 p-4">
      {/* Usefulness breakdown */}
      <div className="rounded-2xl p-4" style={{ background: '#f9fafb' }}>
        <div className="flex items-center gap-4">
          <UsefulnessRing score={score} />
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: '#111827' }}>Usefulness Score</p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
              {score >= 80 ? 'Highly relevant to your role and goals' : score >= 65 ? 'Relevant to your current focus areas' : 'Useful, but not your top priority right now'}
            </p>
            {profile?.jobTitle && <p className="text-xs mt-1.5 font-semibold" style={{ color: '#F97316' }}>Scored for {profile.jobTitle}s</p>}
          </div>
        </div>
      </div>

      {/* Top 3 takeaways */}
      <div>
        <p className="text-sm font-bold mb-2" style={{ color: '#111827' }}>Top 3 Takeaways for You</p>
        {takeaways.map((t, i) => (
          <div key={i} className="flex gap-3 mb-2 p-3 rounded-2xl" style={{ background: '#fff7ed' }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#F97316', color: '#fff' }}>{i + 1}</span>
            <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>{t}</p>
          </div>
        ))}
      </div>

      {/* Chapter guide */}
      <div className="rounded-2xl p-4" style={{ background: '#eff6ff' }}>
        <p className="text-sm font-bold mb-2" style={{ color: '#1e40af' }}>📖 Chapter Guide</p>
        <p className="text-xs mb-3" style={{ color: '#3b82f6' }}>Full book: {guide.totalHours}h · Core value: {guide.coreHours}h</p>
        <div className="space-y-1.5 mb-3">
          {guide.coreChapters.map(ch => (
            <div key={ch} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#3b82f6' }} />
              <span className="text-xs font-semibold" style={{ color: '#1e40af' }}>{ch}</span>
              <span className="text-xs" style={{ color: '#93c5fd' }}>— core value</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3" style={{ background: '#dbeafe' }}>
          <p className="text-xs font-bold" style={{ color: '#1d4ed8' }}>⏱ Read {guide.coreChapters.join(', ')} in {guide.coreHours}h for {guide.coreValue}% of the value</p>
        </div>
      </div>

      {/* Short on time? */}
      <div className="rounded-2xl p-4" style={{ background: '#f0fdf4' }}>
        <p className="text-xs font-bold mb-1" style={{ color: '#166534' }}>⚡ Short on time?</p>
        <p className="text-xs mb-2" style={{ color: '#16a34a' }}>Try this instead — covers the same core ideas in less time:</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold" style={{ color: '#111827' }}>{guide.alternative.title}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>{guide.alternative.author} · {guide.alternative.time}</p>
          </div>
          <button className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: '#16a34a', color: '#fff' }}>View</button>
        </div>
      </div>
    </div>
  )
}

// ─── Micro-reading tab ────────────────────────────────────────────────────────
function MicroReadTab({ book }) {
  const chapters = getMicroChapters(book)
  const [done, setDone] = useState(() => JSON.parse(localStorage.getItem(`micro_${book.Work_ID}`) || '[]'))
  const toggleDone = id => {
    const updated = done.includes(id) ? done.filter(d => d !== id) : [...done, id]
    setDone(updated)
    localStorage.setItem(`micro_${book.Work_ID}`, JSON.stringify(updated))
    if (!done.includes(id)) {
      const impact = getImpactStats()
      updateImpact({ microCompleted: (impact.microCompleted || 0) + 0.2 })
    }
  }
  const progress = Math.round((done.length / chapters.length) * 100)
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-bold" style={{ color: '#111827' }}>Micro-Reading Mode</p>
        <span className="text-xs font-bold" style={{ color: '#F97316' }}>{progress}% complete</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: '#F97316' }} />
      </div>
      <p className="text-xs" style={{ color: '#9ca3af' }}>Each session is 5–10 min. Complete at your own pace.</p>
      {chapters.map(ch => (
        <div key={ch.id} className="rounded-2xl p-4" style={{ background: done.includes(ch.id) ? '#f0fdf4' : '#f9fafb', border: `1px solid ${done.includes(ch.id) ? '#bbf7d0' : '#f3f4f6'}` }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#fff7ed', color: '#F97316' }}>⏱ {ch.minutes} min</span>
                {done.includes(ch.id) && <span className="text-xs font-bold" style={{ color: '#16a34a' }}>✓ Done</span>}
              </div>
              <p className="text-sm font-semibold" style={{ color: '#111827' }}>{ch.title}</p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>🎯 {ch.objective}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: '#F97316' }}>💡 "{ch.key}"</p>
            </div>
            <button onClick={() => toggleDone(ch.id)} className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: done.includes(ch.id) ? '#16a34a' : '#f3f4f6', color: done.includes(ch.id) ? '#fff' : '#9ca3af' }}>
              {done.includes(ch.id) ? '✓' : '○'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Action Tracker tab ───────────────────────────────────────────────────────
function ActionTab({ book }) {
  const challenges = getActionChallenges(book)
  const storageKey = `actions_${book.Work_ID}`
  const [outcomes, setOutcomes] = useState(() => JSON.parse(localStorage.getItem(storageKey) || '{}'))

  const setOutcome = (id, value) => {
    const updated = { ...outcomes, [id]: value }
    setOutcomes(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    if (!outcomes[id] && value === 'worked') {
      const impact = getImpactStats()
      updateImpact({ tacticsApplied: (impact.tacticsApplied || 0) + 1 })
    }
  }

  const applied = Object.values(outcomes).filter(v => v !== 'skip').length
  const worked = Object.values(outcomes).filter(v => v === 'worked').length

  return (
    <div className="p-4 space-y-3">
      <p className="text-sm font-bold" style={{ color: '#111827' }}>Action Challenges</p>
      <p className="text-xs" style={{ color: '#9ca3af' }}>Apply each tactic, then log the outcome. This builds your real-world impact score.</p>
      {applied > 0 && (
        <div className="flex gap-3 p-3 rounded-2xl" style={{ background: '#f0fdf4' }}>
          <div className="text-center flex-1"><p className="text-lg font-black" style={{ color: '#16a34a' }}>{applied}</p><p className="text-xs" style={{ color: '#6b7280' }}>tried</p></div>
          <div className="w-px" style={{ background: '#bbf7d0' }} />
          <div className="text-center flex-1"><p className="text-lg font-black" style={{ color: '#F97316' }}>{worked}</p><p className="text-xs" style={{ color: '#6b7280' }}>worked</p></div>
          <div className="w-px" style={{ background: '#bbf7d0' }} />
          <div className="text-center flex-1"><p className="text-lg font-black" style={{ color: '#3b82f6' }}>{applied > 0 ? Math.round(worked / applied * 100) : 0}%</p><p className="text-xs" style={{ color: '#6b7280' }}>success</p></div>
        </div>
      )}
      {challenges.map(c => (
        <div key={c.id} className="rounded-2xl p-4" style={{ background: '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#ede9fe', color: '#7c3aed' }}>{c.chapter}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: c.difficulty === 'Easy' ? '#dcfce7' : c.difficulty === 'Medium' ? '#fff7ed' : '#fef2f2', color: c.difficulty === 'Easy' ? '#16a34a' : c.difficulty === 'Medium' ? '#F97316' : '#dc2626' }}>{c.difficulty}</span>
            <span className="text-xs" style={{ color: '#9ca3af' }}>⏱ {c.time}</span>
          </div>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>{c.challenge}</p>
          {!outcomes[c.id] ? (
            <div className="flex gap-2">
              <button onClick={() => setOutcome(c.id, 'worked')} className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: '#dcfce7', color: '#16a34a' }}>✅ It worked!</button>
              <button onClick={() => setOutcome(c.id, 'tried')} className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: '#fff7ed', color: '#F97316' }}>Tried it</button>
              <button onClick={() => setOutcome(c.id, 'skip')} className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: '#f3f4f6', color: '#9ca3af' }}>Skip</button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 rounded-xl" style={{ background: outcomes[c.id] === 'worked' ? '#dcfce7' : '#f3f4f6' }}>
              <span className="text-xs font-bold" style={{ color: outcomes[c.id] === 'worked' ? '#16a34a' : '#9ca3af' }}>
                {outcomes[c.id] === 'worked' ? '✅ Logged as worked!' : outcomes[c.id] === 'tried' ? '📝 Logged as tried' : '⏭ Skipped'}
              </span>
              <button onClick={() => setOutcome(c.id, undefined)} className="text-xs" style={{ color: '#9ca3af' }}>undo</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Reviews tab ──────────────────────────────────────────────────────────────
function ReviewsTab({ book, onWriteReview }) {
  const profile = JSON.parse(localStorage.getItem('bookroi_profile') || '{}')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)
  const [form, setForm] = useState({ roiScore: 4, timeSpent: 5, keyTakeaway: '' })
  const [submitting, setSubmitting] = useState(false)

  const allReviews = book.reviews || [
    { jobTitle: 'Product Manager', industry: 'Technology', keyTakeaway: 'Changed how I structure my team rituals completely', roiScore: 5, timeSpent: 6 },
    { jobTitle: 'Marketing Director', industry: 'Marketing', keyTakeaway: 'Applied the 2-minute rule — saved 45 mins/day on email', roiScore: 4, timeSpent: 5 },
    { jobTitle: 'Software Engineer', industry: 'Technology', keyTakeaway: 'Environment design stopped me doom-scrolling during work hours', roiScore: 5, timeSpent: 7 },
    { jobTitle: 'Sales Manager', industry: 'Sales', keyTakeaway: 'Identity-based habits reframed how I coach my whole team', roiScore: 4, timeSpent: 6 },
  ]

  const filtered = filter === 'mine'
    ? allReviews.filter(r => r.jobTitle?.toLowerCase().includes((profile.jobTitle || '').toLowerCase()) || r.industry?.toLowerCase() === (profile.industry || '').toLowerCase())
    : allReviews

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    await submitReview({ ...form, bookId: book.Work_ID, userEmail: profile.email || 'anonymous' })
    const impact = getImpactStats()
    updateImpact({ reviews: (impact.reviews || 0) + 1 })
    setReviewDone(true)
    setSubmitting(false)
  }

  return (
    <div className="p-4 space-y-3">
      {/* Filter */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: filter === 'all' ? '#F97316' : '#f3f4f6', color: filter === 'all' ? '#fff' : '#6b7280' }}>All Reviews ({allReviews.length})</button>
        {profile.jobTitle && <button onClick={() => setFilter('mine')} className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: filter === 'mine' ? '#F97316' : '#f3f4f6', color: filter === 'mine' ? '#fff' : '#6b7280' }}>My Role ({filtered.length})</button>}
      </div>
      {filter === 'mine' && <p className="text-xs" style={{ color: '#9ca3af' }}>Showing reviews from {profile.jobTitle}s and {profile.industry} professionals</p>}

      {filtered.length === 0 && <p className="text-center py-6 text-sm" style={{ color: '#9ca3af' }}>No reviews yet from {profile.jobTitle}s</p>}

      {filtered.map((r, i) => (
        <div key={i} className="rounded-2xl p-4" style={{ background: '#f9fafb' }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-bold" style={{ color: '#374151' }}>{r.jobTitle}</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>{r.industry}</p>
            </div>
            <div className="flex">{'★'.repeat(r.roiScore).split('').map((s, j) => <span key={j} style={{ color: '#F97316', fontSize: 13 }}>{s}</span>)}</div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>"{r.keyTakeaway}"</p>
          <p className="text-xs mt-2" style={{ color: '#d1d5db' }}>Read in {r.timeSpent}h</p>
        </div>
      ))}

      {/* Write review */}
      {reviewDone ? (
        <div className="text-center py-4 rounded-2xl" style={{ background: '#f0fdf4' }}>
          <p className="font-bold text-sm" style={{ color: '#16a34a' }}>✅ Review submitted! Thank you.</p>
        </div>
      ) : !showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-2xl text-sm font-bold" style={{ border: '2px solid #fed7aa', color: '#F97316', background: '#fff' }}>
          ✍️ Write a Review
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl p-4 space-y-3" style={{ background: '#f9fafb' }}>
          <p className="text-sm font-bold" style={{ color: '#111827' }}>Your Review</p>
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: '#9ca3af' }}>ROI SCORE</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setForm(f => ({ ...f, roiScore: n }))} className="w-9 h-9 rounded-xl text-sm font-bold" style={{ background: form.roiScore >= n ? '#F97316' : '#f3f4f6', color: form.roiScore >= n ? '#fff' : '#9ca3af' }}>{n}</button>)}
            </div>
          </div>
          <textarea required value={form.keyTakeaway} onChange={e => setForm(f => ({ ...f, keyTakeaway: e.target.value }))} placeholder="What one thing did you apply at work?" rows={3} className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none" style={{ border: '1px solid #e5e7eb', background: '#fff' }} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: '#f3f4f6', color: '#6b7280' }}>Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-xs font-bold" style={{ background: '#F97316', color: '#fff', opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BookDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()
  const [book, setBook] = useState(state?.book || null)
  const [loading, setLoading] = useState(!state?.book)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')

  const profile = JSON.parse(localStorage.getItem('bookroi_profile') || '{}')

  useEffect(() => {
    if (!state?.book) {
      getBook(decodeURIComponent(id)).then(data => { setBook(data); setLoading(false) })
    }
    const savedBooks = JSON.parse(localStorage.getItem('bookroi_saved') || '[]')
    if (book && savedBooks.find(b => b.Work_ID === book.Work_ID)) setSaved(true)
  }, [])

  const toggleSave = () => {
    const savedBooks = JSON.parse(localStorage.getItem('bookroi_saved') || '[]')
    if (saved) {
      localStorage.setItem('bookroi_saved', JSON.stringify(savedBooks.filter(b => b.Work_ID !== book.Work_ID)))
      setSaved(false)
    } else {
      localStorage.setItem('bookroi_saved', JSON.stringify([...savedBooks, book]))
      setSaved(true)
      const impact = getImpactStats()
      updateImpact({ saved: (impact.saved || 0) + 1 })
    }
  }

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!book) return <div className="flex flex-col items-center justify-center h-screen gap-3"><p className="text-gray-400">Book not found</p><button onClick={() => navigate('/')} className="text-orange-500 text-sm font-semibold">← Back</button></div>

  const score = calcUsefulnessScore(book, profile)
  const TABS = ['Overview', 'Micro-Read', 'Actions', 'Reviews']

  return (
    <div className="pb-4">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #1E3A5F, #0F2344)', paddingBottom: 20 }}>
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,.12)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={toggleSave} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: saved ? '#F97316' : 'rgba(255,255,255,.12)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'white' : 'none'} stroke="white" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
        </div>
        <div className="flex gap-4 px-4">
          <div className="w-24 h-34 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl" style={{ width: 88, height: 128, background: '#374151' }}>
            {book.Cover_URL ? <img src={book.Cover_URL} alt={book.Title} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} /> : <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>}
          </div>
          <div className="flex-1 pt-1">
            <h1 className="font-bold text-lg leading-tight" style={{ color: '#fff' }}>{book.Title}</h1>
            <p className="text-sm mt-1" style={{ color: '#d1d5db' }}>{book.Author}</p>
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full capitalize" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>{book.Category}</span>
          </div>
          {/* Score ring */}
          <div className="flex-shrink-0 pt-1">
            <UsefulnessRing score={score} />
          </div>
        </div>
        <div className="px-4 mt-4">
          <button className="w-full py-3 rounded-2xl font-bold text-sm shadow-lg" style={{ background: '#F97316', color: '#fff' }}>Start Reading</button>
        </div>
      </div>

      {/* Tabs */}
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'Overview'   && <OverviewTab book={book} profile={profile} score={score} />}
      {activeTab === 'Micro-Read' && <MicroReadTab book={book} />}
      {activeTab === 'Actions'    && <ActionTab book={book} />}
      {activeTab === 'Reviews'    && <ReviewsTab book={book} />}
    </div>
  )
}
