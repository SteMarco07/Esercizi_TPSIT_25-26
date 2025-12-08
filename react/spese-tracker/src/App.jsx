import { useState, useEffect, useMemo } from 'react'
import PocketBase from 'pocketbase'
import './App.css'
import { Routes, Route, Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import ElencoSpese from './components/ElencoSpese'
import Categorie from './components/Categorie'
import ElencoGrafici from './components/ElencoGrafici'
import Login from './components/Login'
import Signup from './components/Signup'
import { AuthProvider } from './contexts/AuthContext'
import RequireAuth from './components/RequireAuth'
import { useAuth } from './contexts/AuthContext'

// safe localStorage helpers (avoid ReferenceError in non-browser contexts)
function safeGetItem(key, fallback = null) {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return fallback
    const v = window.localStorage.getItem(key)
    return v === null ? fallback : v
  } catch (e) {
    return fallback
  }
}

function safeSetItem(key, value) {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return
    window.localStorage.setItem(key, value)
  } catch (e) {
    // ignore
  }
}

function App() {
  const [showGrafici, setShowGrafici] = useState(true)
  // create PocketBase client inside component to avoid accessing localStorage
  // during module evaluation (can cause issues in non-browser envs)
  const pb = useMemo(() => new PocketBase('http://127.0.0.1:8090'), [])

  // theme persistence: initialize using safe helper
  const [theme, setTheme] = useState(() => safeGetItem('theme', 'dark'))

  useEffect(() => {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-theme', theme)
    }
    safeSetItem('theme', theme)
  }, [theme])

  const [spese, setSpese] = useState([])

  useEffect(() => {
    async function getSpese() {
      try {
        // request spese with expanded categoria relation
        const listSpese = await pb.collection('spese').getFullList({ expand: 'categoria' });
        // enrich each record with a convenient categoriaNome field
        const enriched = listSpese.map(s => ({ ...s, categoriaNome: s.expand?.categoria?.nome || s.categoria || '' }))
        setSpese(enriched)
      } catch (error) {
        console.error('Errore nel caricamento delle spese:', error)
      }
    }
    getSpese();
  }, [])

  const [categorie, setCategorie] = useState([])

  useEffect(() => {
    async function getCategorie() {
      try {
        const listCategorie = await pb.collection('spese_categorie').getFullList();
        setCategorie(listCategorie)
      } catch (error) {
        console.error('Errore nel caricamento delle categorie:', error)
      }
    }
    getCategorie();
  }, [])

  return (
    <AuthProvider>
      <AppContent theme={theme} setTheme={setTheme} />
    </AuthProvider>
  )
}

function AppContent({ theme, setTheme }) {
  const { user } = useAuth() || {}

  return (
    <div className="flex">
      {user && <Sidebar theme={theme} setTheme={setTheme} />}
      <div className="flex-1 overflow-y-hidden" style={{ height: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/spese" element={<RequireAuth><ElencoSpese /></RequireAuth>} />
          <Route path="/categorie" element={<RequireAuth><Categorie /></RequireAuth>} />
          <Route path="/grafici" element={<RequireAuth><ElencoGrafici /></RequireAuth>} />
          <Route path="*" element={<RequireAuth><Home /></RequireAuth>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
