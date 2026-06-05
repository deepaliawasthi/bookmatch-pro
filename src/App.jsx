import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import BookDetail from './pages/BookDetail'
import ProfileSetup from './pages/ProfileSetup'
import Library from './pages/Library'
import Login from './pages/Login'

// ─── Auth guard ───────────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const user = localStorage.getItem('bookroi_user')
  if (!user) return <Navigate to="/login" replace />
  return children
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────
function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const hideOn = ['/login', '/profile']
  const isBook = location.pathname.startsWith('/book/')
  if (hideOn.includes(location.pathname) || isBook) return null

  const tabs = [
    { path: '/',        icon: HomeIcon,    label: 'Home' },
    { path: '/library', icon: LibraryIcon, label: 'Library' },
    { path: '/profile', icon: ProfileIcon, label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex z-50">
      {tabs.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path
        return (
          <button key={path} onClick={() => navigate(path)} className="flex-1 flex flex-col items-center py-3 gap-1">
            <Icon active={active} />
            <span className={`text-xs font-medium ${active ? 'text-orange-500' : 'text-gray-400'}`}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#F97316' : 'none'} stroke={active ? '#F97316' : '#9CA3AF'} strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function LibraryIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#F97316' : '#9CA3AF'} strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  )
}
function ProfileIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#F97316' : '#9CA3AF'} strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative">
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/book/:id" element={<RequireAuth><BookDetail /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfileSetup /></RequireAuth>} />
        <Route path="/library" element={<RequireAuth><Library /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
