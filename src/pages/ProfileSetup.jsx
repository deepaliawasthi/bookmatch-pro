import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveProfile } from '../api'

const INDUSTRIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Sales', 'Operations', 'Other']
const SKILLS = ['Analytics', 'Leadership', 'Communication', 'Strategy', 'Product Management', 'Sales', 'Finance', 'Design', 'Engineering', 'Marketing', 'Operations', 'People Management']
const GOALS = [
  { value: 'skills', label: '🎯 Learn new skills' },
  { value: 'promotion', label: '📈 Get promoted' },
  { value: 'startup', label: '🚀 Start a business' },
  { value: 'current', label: '📰 Stay current' },
]

export default function ProfileSetup() {
  const navigate = useNavigate()
  const saved = JSON.parse(localStorage.getItem('bookroi_profile') || '{}')
  const [form, setForm] = useState({
    jobTitle: saved.jobTitle || '',
    industry: saved.industry || '',
    skills: saved.skills || [],
    readingGoal: saved.readingGoal || '',
    email: saved.email || '',
  })
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const toggleSkill = skill => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill]
    }))
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    await saveProfile(form)
    localStorage.setItem('bookroi_profile', JSON.stringify(form))
    setDone(true)
    setSaving(false)
    setTimeout(() => navigate('/'), 700)
  }

  return (
    <div className="pb-28">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #1E3A5F 0%, #0F2344 100%)' }} className="px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            onClick={() => { localStorage.removeItem('bookroi_user'); navigate('/login') }}
            className="text-xs text-orange-300 font-semibold bg-white/10 px-3 py-1.5 rounded-full"
          >
            Log out
          </button>
        </div>
        <h1 className="text-white text-xl font-bold">My Profile</h1>
        <p className="text-gray-300 text-sm mt-1">Help us find books that match your work</p>
      </div>

      <form onSubmit={handleSave} className="px-4 -mt-4 space-y-5">

        {/* Email */}
        <div className="bg-white rounded-3xl shadow-sm p-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Email</label>
          <input
            type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@company.com"
            className="w-full text-sm text-gray-800 outline-none placeholder-gray-300"
          />
        </div>

        {/* Job Title */}
        <div className="bg-white rounded-3xl shadow-sm p-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Job Title</label>
          <input
            required type="text" value={form.jobTitle}
            onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
            placeholder="e.g. Product Manager, Marketing Director"
            className="w-full text-sm text-gray-800 outline-none placeholder-gray-300"
          />
        </div>

        {/* Industry */}
        <div className="bg-white rounded-3xl shadow-sm p-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Industry</label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map(ind => (
              <button
                key={ind} type="button" onClick={() => setForm(f => ({ ...f, industry: ind }))}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                  form.industry === ind
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-50 text-gray-500 border-gray-100'
                }`}
              >{ind}</button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-3xl shadow-sm p-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Skills</label>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <button
                key={skill} type="button" onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                  form.skills.includes(skill)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-50 text-gray-500 border-gray-100'
                }`}
              >{skill}</button>
            ))}
          </div>
        </div>

        {/* Reading Goal */}
        <div className="bg-white rounded-3xl shadow-sm p-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Reading Goal</label>
          <div className="space-y-2">
            {GOALS.map(g => (
              <label
                key={g.value}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors border ${
                  form.readingGoal === g.value
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <input
                  type="radio" name="goal" value={g.value}
                  checked={form.readingGoal === g.value}
                  onChange={e => setForm(f => ({ ...f, readingGoal: e.target.value }))}
                  className="accent-orange-500"
                />
                <span className="text-sm text-gray-700 font-medium">{g.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit" disabled={saving || done}
          className="w-full bg-orange-500 text-white py-4 rounded-3xl font-bold text-sm shadow-lg disabled:opacity-60"
        >
          {done ? '✅ Saved!' : saving ? 'Saving...' : 'Save & See My Books →'}
        </button>
      </form>
    </div>
  )
}
