import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveProfile } from '../api'

const INDUSTRIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Sales', 'Operations', 'Consulting', 'Other']
const SKILLS = ['Leadership', 'Analytics', 'Communication', 'Strategy', 'Product Management', 'Sales', 'Finance', 'Design', 'Engineering', 'Marketing', 'Operations', 'People Management']
const GOALS = [
  { value: 'skills',    emoji: '🎯', label: 'Learn new skills' },
  { value: 'promotion', emoji: '📈', label: 'Get promoted' },
  { value: 'startup',   emoji: '🚀', label: 'Start a business' },
  { value: 'current',   emoji: '📰', label: 'Stay current in my field' },
]
const TIME_OPTIONS = [
  { value: '15min', label: '15 min/day', emoji: '⚡' },
  { value: '30min', label: '30 min/day', emoji: '📖' },
  { value: '1hr',   label: '1 hr/day',   emoji: '🎯' },
  { value: '2hr+',  label: '2+ hrs/day', emoji: '🏆' },
]
const SKILL_GAPS = ['Stakeholder Management', 'Data-Driven Decisions', 'Team Leadership', 'Public Speaking', 'Strategic Thinking', 'Time Management', 'Negotiation', 'Financial Acumen']

// ─── Step indicator ───────────────────────────────────────────────────────────
function Steps({ current }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {[1, 2].map(n => (
        <div key={n} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            current >= n ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>{n}</div>
          {n < 2 && <div className={`w-10 h-0.5 rounded ${current > n ? 'bg-orange-500' : 'bg-gray-200'}`} />}
        </div>
      ))}
      <span className="text-xs text-gray-400 ml-1">
        {current === 1 ? 'Create account' : 'Your profession'}
      </span>
    </div>
  )
}

// ─── Chip selector ────────────────────────────────────────────────────────────
function Chips({ options, selected, onToggle, single = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const val = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : `${opt.emoji} ${opt.label}`
        const active = single ? selected === val : selected.includes(val)
        return (
          <button
            key={val}
            type="button"
            onClick={() => onToggle(val)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              active ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-orange-200'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')   // 'login' | 'signup'
  const [step, setStep] = useState(1)        // signup step 1 or 2
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [account, setAccount] = useState({ name: '', email: '', password: '' })
  const [profession, setProfession] = useState({ jobTitle: '', industry: '', skills: [], readingGoal: '', timeAvailable: '', skillGaps: [] })

  // ── Login submit ─────────────────────────────────────────────────────────────
  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    if (!account.email || !account.password) { setError('Please fill in all fields'); return }
    if (account.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    localStorage.setItem('bookroi_user', JSON.stringify({ name: account.email.split('@')[0], email: account.email }))
    setLoading(false)
    navigate('/')
  }

  // ── Signup step 1 → 2 ────────────────────────────────────────────────────────
  const handleStep1 = e => {
    e.preventDefault()
    setError('')
    if (!account.name || !account.email || !account.password) { setError('Please fill in all fields'); return }
    if (account.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setStep(2)
  }

  // ── Signup step 2 submit ─────────────────────────────────────────────────────
  const handleStep2 = async e => {
    e.preventDefault()
    setError('')
    if (!profession.jobTitle || !profession.industry) { setError('Please enter your job title and industry'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const user = { name: account.name, email: account.email }
    localStorage.setItem('bookroi_user', JSON.stringify(user))

    const profile = { ...profession, email: account.email, name: account.name }
    localStorage.setItem('bookroi_profile', JSON.stringify(profile))
    await saveProfile(profile)

    setLoading(false)
    navigate('/')
  }

  const switchTab = t => { setTab(t); setStep(1); setError(''); setAccount({ name: '', email: '', password: '' }) }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #1E3A5F 0%, #0F2344 50%, #f9fafb 50%)' }}>

      {/* Navy top */}
      <div className="px-6 pt-12 pb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4">📚</div>
        <h1 className="text-white text-2xl font-bold">BookMatch Pro</h1>
        <p className="text-blue-200 text-sm mt-1 text-center">AI-matched books for your career</p>
      </div>

      {/* White card */}
      <div className="flex-1 bg-white rounded-t-3xl px-5 pt-5 pb-10 shadow-2xl overflow-y-auto">

        {/* Tab switcher — only show on step 1 */}
        {step === 1 && (
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
            <button onClick={() => switchTab('login')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Log In</button>
            <button onClick={() => switchTab('signup')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Sign Up</button>
          </div>
        )}

        {/* Step indicator — signup step 2 only */}
        {tab === 'signup' && step === 2 && <Steps current={2} />}
        {tab === 'signup' && step === 1 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">1</div>
            <div className="w-10 h-0.5 bg-gray-200 rounded" />
            <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-xs text-gray-400 ml-1">Create account</span>
          </div>
        )}

        {/* ── LOGIN FORM ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Email" type="email" value={account.email} onChange={v => setAccount(a => ({ ...a, email: v }))} placeholder="you@company.com" />
            <Field label="Password" type="password" value={account.password} onChange={v => setAccount(a => ({ ...a, password: v }))} placeholder="••••••••" />
            {error && <ErrorMsg msg={error} />}
            <SubmitBtn loading={loading} label="Log In →" />
            <p className="text-center text-xs text-gray-400 pt-1">
              No account? <button type="button" onClick={() => switchTab('signup')} className="text-orange-500 font-semibold">Sign up free</button>
            </p>
          </form>
        )}

        {/* ── SIGNUP STEP 1: Account ── */}
        {tab === 'signup' && step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <Field label="Full Name" type="text" value={account.name} onChange={v => setAccount(a => ({ ...a, name: v }))} placeholder="Deepali Seth" />
            <Field label="Email" type="email" value={account.email} onChange={v => setAccount(a => ({ ...a, email: v }))} placeholder="you@company.com" />
            <Field label="Password" type="password" value={account.password} onChange={v => setAccount(a => ({ ...a, password: v }))} placeholder="Min. 6 characters" />
            {error && <ErrorMsg msg={error} />}
            <SubmitBtn loading={false} label="Next: Your Profession →" />
            <p className="text-center text-xs text-gray-400 pt-1">
              Have an account? <button type="button" onClick={() => switchTab('login')} className="text-orange-500 font-semibold">Log in</button>
            </p>
          </form>
        )}

        {/* ── SIGNUP STEP 2: Profession ── */}
        {tab === 'signup' && step === 2 && (
          <form onSubmit={handleStep2} className="space-y-5">

            {/* Job title */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Job Title *</label>
              <input
                required
                type="text"
                value={profession.jobTitle}
                onChange={e => setProfession(p => ({ ...p, jobTitle: e.target.value }))}
                placeholder="e.g. Product Manager, CMO, Engineer"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Industry *</label>
              <Chips
                options={INDUSTRIES}
                selected={profession.industry}
                single
                onToggle={v => setProfession(p => ({ ...p, industry: v }))}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills <span className="normal-case font-normal text-gray-300">(pick all that apply)</span></label>
              <Chips
                options={SKILLS}
                selected={profession.skills}
                onToggle={v => setProfession(p => ({
                  ...p,
                  skills: p.skills.includes(v) ? p.skills.filter(s => s !== v) : [...p.skills, v]
                }))}
              />
            </div>

            {/* Reading goal */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reading Goal</label>
              <Chips
                options={GOALS}
                selected={profession.readingGoal}
                single
                onToggle={v => setProfession(p => ({ ...p, readingGoal: v }))}
              />
            </div>

            {/* Time available */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time Available per Day</label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_OPTIONS.map(t => (
                  <button key={t.value} type="button" onClick={() => setProfession(p => ({ ...p, timeAvailable: t.value }))}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold border text-left transition-all"
                    style={{ background: profession.timeAvailable === t.value ? '#fff7ed' : '#f9fafb', borderColor: profession.timeAvailable === t.value ? '#F97316' : '#f3f4f6', color: profession.timeAvailable === t.value ? '#F97316' : '#6b7280' }}>
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill gaps */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Top Skill Gaps <span className="normal-case font-normal text-gray-300">(optional)</span></label>
              <p className="text-xs text-gray-300 mb-2">We'll match books to close these gaps</p>
              <Chips
                options={SKILL_GAPS}
                selected={profession.skillGaps}
                onToggle={v => setProfession(p => ({
                  ...p,
                  skillGaps: p.skillGaps.includes(v) ? p.skillGaps.filter(s => s !== v) : [...p.skillGaps, v]
                }))}
              />
            </div>

            {error && <ErrorMsg msg={error} />}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-2xl text-sm font-bold text-gray-500 bg-gray-100"
              >
                ← Back
              </button>
              <SubmitBtn loading={loading} label={loading ? 'Setting up...' : 'Show My Books →'} className="flex-1" />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
      />
    </div>
  )
}

function ErrorMsg({ msg }) {
  return <p className="text-red-500 text-xs font-medium bg-red-50 px-3 py-2 rounded-xl">{msg}</p>
}

function SubmitBtn({ loading, label, className = 'w-full' }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`${className} bg-orange-500 text-white py-4 rounded-2xl font-bold text-sm shadow-md disabled:opacity-60 hover:bg-orange-600 transition-colors`}
    >
      {loading
        ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />{label}</span>
        : label}
    </button>
  )
}
