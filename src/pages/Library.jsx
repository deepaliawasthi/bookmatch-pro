import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALL_BADGES, getImpactStats, getStreak, calcUsefulnessScore } from '../api'

const TABS = ['Saved', 'Badges', 'Impact']

function BadgeCard({ badge, unlocked }) {
  return (
    <div className="rounded-2xl p-3 flex flex-col items-center gap-1.5" style={{ background: unlocked ? '#fff7ed' : '#f9fafb', border: `1px solid ${unlocked ? '#fed7aa' : '#f3f4f6'}`, opacity: unlocked ? 1 : 0.5 }}>
      <span style={{ fontSize: 28 }}>{badge.icon}</span>
      <p className="text-xs font-bold text-center leading-tight" style={{ color: unlocked ? '#111827' : '#9ca3af' }}>{badge.name}</p>
      <p className="text-xs text-center" style={{ color: '#9ca3af', fontSize: 10 }}>{badge.desc}</p>
      {unlocked && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#F97316', color: '#fff' }}>Earned</span>}
    </div>
  )
}

export default function Library() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Saved')

  const saved = JSON.parse(localStorage.getItem('bookroi_saved') || '[]')
  const profile = JSON.parse(localStorage.getItem('bookroi_profile') || '{}')
  const impact = getImpactStats()
  const streak = getStreak()

  const badgeContext = {
    saved: impact.saved || saved.length,
    streak: streak.count,
    tacticsApplied: impact.tacticsApplied || 0,
    reviews: impact.reviews || 0,
    microCompleted: impact.microCompleted || 0,
    categoryCounts: impact.categoryCounts || {},
  }

  const earnedBadges = ALL_BADGES.filter(b => b.condition(badgeContext))
  const lockedBadges = ALL_BADGES.filter(b => !b.condition(badgeContext))

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-3" style={{ background: '#fff' }}>
        <h1 className="text-xl font-bold" style={{ color: '#111827' }}>My Library</h1>
        <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{saved.length} saved · {earnedBadges.length} badges earned</p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-100 px-4 bg-white">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-3 text-xs font-bold" style={{ color: tab === t ? '#F97316' : '#9ca3af', borderBottom: tab === t ? '2px solid #F97316' : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Saved */}
      {tab === 'Saved' && (
        <div className="px-4 py-4">
          {saved.length === 0 ? (
            <div className="flex flex-col items-center pt-16 gap-3">
              <span style={{ fontSize: 48 }}>📚</span>
              <p className="text-sm" style={{ color: '#9ca3af' }}>No saved books yet</p>
              <button onClick={() => navigate('/')} className="mt-1 px-6 py-2 rounded-full text-sm font-bold" style={{ background: '#F97316', color: '#fff' }}>Browse Books</button>
            </div>
          ) : (
            <div className="space-y-3">
              {saved.map(book => {
                const score = calcUsefulnessScore(book, profile)
                return (
                  <div key={book.Work_ID} onClick={() => navigate(`/book/${encodeURIComponent(book.Work_ID)}`, { state: { book } })} className="flex gap-3 rounded-2xl p-3 cursor-pointer" style={{ background: '#f9fafb' }}>
                    <div className="rounded-xl overflow-hidden flex-shrink-0" style={{ width: 52, height: 72, background: '#e5e7eb' }}>
                      {book.Cover_URL ? <img src={book.Cover_URL} alt={book.Title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">📚</div>}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="font-semibold text-sm line-clamp-2 leading-tight" style={{ color: '#111827' }}>{book.Title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{book.Author}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: score >= 80 ? '#dcfce7' : '#fff7ed', color: score >= 80 ? '#16a34a' : '#F97316' }}>{score}/100 fit</span>
                        <span className="text-xs capitalize" style={{ color: '#c4b5fd' }}>{book.Category}</span>
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" className="self-center flex-shrink-0"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      {tab === 'Badges' && (
        <div className="px-4 py-4">
          {streak.count > 0 && (
            <div className="rounded-2xl p-4 mb-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1E3A5F, #0F2344)' }}>
              <span style={{ fontSize: 32 }}>🔥</span>
              <div>
                <p className="font-bold" style={{ color: '#fff' }}>{streak.count}-Day Reading Streak</p>
                <p className="text-xs mt-0.5" style={{ color: '#93c5fd' }}>Keep it going — you're building a habit!</p>
              </div>
            </div>
          )}
          {earnedBadges.length > 0 && (
            <>
              <p className="text-xs font-bold mb-3" style={{ color: '#F97316' }}>EARNED ({earnedBadges.length})</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {earnedBadges.map(b => <BadgeCard key={b.id} badge={b} unlocked />)}
              </div>
            </>
          )}
          <p className="text-xs font-bold mb-3" style={{ color: '#9ca3af' }}>LOCKED ({lockedBadges.length})</p>
          <div className="grid grid-cols-3 gap-2">
            {lockedBadges.map(b => <BadgeCard key={b.id} badge={b} unlocked={false} />)}
          </div>
        </div>
      )}

      {/* Impact */}
      {tab === 'Impact' && (
        <div className="px-4 py-4 space-y-3">
          <p className="text-xs font-bold mb-1" style={{ color: '#9ca3af' }}>YOUR REAL-WORLD IMPACT</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Tactics Applied', value: impact.tacticsApplied || 0, icon: '⚡', color: '#F97316', bg: '#fff7ed' },
              { label: 'Books Saved', value: saved.length, icon: '📚', color: '#3b82f6', bg: '#eff6ff' },
              { label: 'Reviews Written', value: impact.reviews || 0, icon: '💬', color: '#7c3aed', bg: '#ede9fe' },
              { label: 'Day Streak', value: streak.count || 0, icon: '🔥', color: '#16a34a', bg: '#f0fdf4' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl p-4" style={{ background: stat.bg }}>
                <span style={{ fontSize: 24 }}>{stat.icon}</span>
                <p className="text-2xl font-black mt-1" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {impact.tacticsApplied > 0 && (
            <div className="rounded-2xl p-4" style={{ background: '#f0fdf4' }}>
              <p className="text-sm font-bold" style={{ color: '#16a34a' }}>🎉 Great work!</p>
              <p className="text-xs mt-1" style={{ color: '#374151' }}>You've applied <strong>{impact.tacticsApplied}</strong> book tactics at work. That's the whole point — knowledge only has value when it's used.</p>
            </div>
          )}

          <div className="rounded-2xl p-4" style={{ background: '#f9fafb' }}>
            <p className="text-sm font-bold mb-3" style={{ color: '#111827' }}>Next Milestones</p>
            {[
              { label: '3-day streak', current: streak.count, target: 3, icon: '🔥' },
              { label: 'Apply 5 tactics', current: impact.tacticsApplied || 0, target: 5, icon: '⚡' },
              { label: 'Save 3 books', current: saved.length, target: 3, icon: '📚' },
            ].map(m => (
              <div key={m.label} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold" style={{ color: '#374151' }}>{m.icon} {m.label}</span>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{Math.min(m.current, m.target)}/{m.target}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%`, background: '#F97316' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
