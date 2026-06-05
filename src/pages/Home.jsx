import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBooks, getRecommendations, calcUsefulnessScore, getStreak, updateStreak, PLACEHOLDER_BOOKS } from '../api'

const CATEGORIES = ['All', 'Business', 'Leadership', 'Productivity', 'Marketing', 'Finance']

const CAT_COLORS = { business: '#dbeafe', leadership: '#ede9fe', productivity: '#dcfce7', marketing: '#fce7f3', finance: '#fef9c3', negotiation: '#ffedd5' }

function ScoreBadge({ score }) {
  const color = score >= 80 ? '#16a34a' : score >= 65 ? '#F97316' : '#6b7280'
  return (
    <div style={{ position: 'absolute', top: 6, right: 6, width: 34, height: 34, borderRadius: '50%', background: '#fff', border: `2.5px solid ${color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.15)' }}>
      <span style={{ fontSize: 10, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
      <span style={{ fontSize: 7, color: '#9ca3af', lineHeight: 1 }}>fit</span>
    </div>
  )
}

function MonthlyPickBanner({ book, score, onRead }) {
  if (!book) return null
  return (
    <div onClick={onRead} className="mx-4 mb-4 rounded-3xl overflow-hidden cursor-pointer" style={{ background: 'linear-gradient(135deg, #1E3A5F, #0F2344)' }}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#F97316', color: '#fff' }}>📅 Monthly Pick</span>
          <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>🎯 {score}/100 match for you</span>
        </div>
        <div className="flex gap-3">
          <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ background: '#374151' }}>
            {book.Cover_URL ? <img src={book.Cover_URL} alt={book.Title} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} /> : <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>}
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm leading-tight">{book.Title}</p>
            <p className="text-xs mt-0.5" style={{ color: '#d1d5db' }}>{book.Author}</p>
            <p className="text-xs mt-2" style={{ color: '#93c5fd' }}>Matched to your skill gap this month</p>
            <button className="mt-2 text-xs font-bold px-4 py-1.5 rounded-full" style={{ background: '#F97316', color: '#fff' }}>Read Now →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookRow({ book, score, onRead }) {
  const bg = CAT_COLORS[book.Category?.toLowerCase()] || '#f3f4f6'
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50">
      <div className="relative flex-shrink-0" style={{ width: 48, height: 68 }}>
        <div className="w-full h-full rounded-xl overflow-hidden" style={{ background: bg }}>
          {book.Cover_URL
            ? <img src={book.Cover_URL} alt={book.Title} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
            : <div className="w-full h-full flex items-center justify-center text-xl">📚</div>}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight line-clamp-1" style={{ color: '#111827' }}>{book.Title}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{book.Author}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: score >= 80 ? '#dcfce7' : score >= 65 ? '#fff7ed' : '#f3f4f6', color: score >= 80 ? '#16a34a' : score >= 65 ? '#F97316' : '#6b7280' }}>
            {score}/100 fit
          </span>
          <span className="text-xs capitalize" style={{ color: '#c4b5fd' }}>{book.Category}</span>
        </div>
      </div>
      <button onClick={onRead} className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full" style={{ background: '#F97316', color: '#fff' }}>Read</button>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [books, setBooks] = useState([])
  const [recommended, setRecommended] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState({ count: 0 })

  const profile = JSON.parse(localStorage.getItem('bookroi_profile') || '{}')
  const user = JSON.parse(localStorage.getItem('bookroi_user') || '{}')

  useEffect(() => {
    const s = updateStreak()
    setStreak(s)
  }, [])

  useEffect(() => {
    setLoading(true)
    const cat = activeCategory === 'All' ? '' : activeCategory.toLowerCase()
    getBooks(cat).then(data => { setBooks(data); setLoading(false) })
  }, [activeCategory])

  useEffect(() => {
    if (profile.jobTitle && profile.industry) {
      getRecommendations(profile.jobTitle, profile.industry).then(setRecommended)
    }
  }, [])

  const filtered = search
    ? books.filter(b => b.Title?.toLowerCase().includes(search.toLowerCase()) || b.Author?.toLowerCase().includes(search.toLowerCase()))
    : books

  const goToBook = book => navigate(`/book/${encodeURIComponent(book.Work_ID)}`, { state: { book } })
  const monthlyPick = PLACEHOLDER_BOOKS[Math.floor(new Date().getDate() / 4) % PLACEHOLDER_BOOKS.length]
  const monthlyScore = calcUsefulnessScore(monthlyPick, profile)

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 pt-5 pb-3" style={{ background: '#fff' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold" style={{ color: '#111827' }}>BookMatch Pro</h1>
              {streak.count > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#fff7ed', color: '#F97316' }}>
                  🔥 {streak.count} day{streak.count !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              {profile.jobTitle ? `${profile.jobTitle} · ${profile.industry || ''}` : 'Find your next career book'}
            </p>
          </div>
          <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#F97316', color: '#fff' }}>
            {user.name ? user.name[0].toUpperCase() : '📚'}
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ background: '#f3f4f6' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search books, authors, topics..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#374151' }} />
          {search && <button onClick={() => setSearch('')} className="text-gray-400 text-xs">✕</button>}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors" style={{ background: activeCategory === cat ? '#F97316' : '#f3f4f6', color: activeCategory === cat ? '#fff' : '#6b7280' }}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* Monthly pick */}
          {!search && <MonthlyPickBanner book={monthlyPick} score={monthlyScore} onRead={() => goToBook(monthlyPick)} />}

          {/* Recommended for you */}
          {recommended.length > 0 && !search && profile.jobTitle && (
            <div className="mb-3">
              <div className="flex items-center justify-between px-4 mb-2">
                <span className="text-xs font-bold" style={{ color: '#374151' }}>Matched for {profile.jobTitle}s</span>
                <span className="text-xs font-semibold" style={{ color: '#F97316' }}>see all</span>
              </div>
              <div className="flex gap-3 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {recommended.map(book => {
                  const score = calcUsefulnessScore(book, profile)
                  return (
                    <div key={book.Work_ID} onClick={() => goToBook(book)} className="flex-shrink-0 cursor-pointer" style={{ width: 110 }}>
                      <div className="relative rounded-2xl overflow-hidden" style={{ height: 140, background: CAT_COLORS[book.Category?.toLowerCase()] || '#f3f4f6' }}>
                        {book.Cover_URL ? <img src={book.Cover_URL} alt={book.Title} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} /> : <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>}
                        <ScoreBadge score={score} />
                      </div>
                      <p className="mt-1 text-xs font-semibold line-clamp-2 leading-tight" style={{ color: '#111827' }}>{book.Title}</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>{book.Author}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Main book list */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold" style={{ color: '#374151' }}>
                {search ? `Results for "${search}"` : activeCategory === 'All' ? 'All Books' : activeCategory}
              </span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>{filtered.length} books</span>
            </div>
            {filtered.length === 0
              ? <p className="text-center py-12 text-sm" style={{ color: '#9ca3af' }}>No books found</p>
              : filtered.map(book => (
                  <BookRow key={book.Work_ID} book={book} score={calcUsefulnessScore(book, profile)} onRead={() => goToBook(book)} />
                ))
            }
          </div>
        </>
      )}
    </div>
  )
}
