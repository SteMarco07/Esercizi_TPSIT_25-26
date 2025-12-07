import { useState, useEffect } from 'react'
import ElencoSpese from '../components/ElencoSpese'
import ElencoGrafici from '../components/ElencoGrafici'
import { getSpese, getCategorie, addSpesa, deleteSpesa } from '../services/pocketbaseService'

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

function Home() {
  const [showGrafici, setShowGrafici] = useState(true)

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
    const fetchSpese = async () => {
      const data = await getSpese()
      setSpese(data)
    }
    fetchSpese()
  }, [])

  const [categorie, setCategorie] = useState([])

  useEffect(() => {
    const fetchCategorie = async () => {
      const data = await getCategorie()
      setCategorie(data)
    }
    fetchCategorie()
  }, [])

  // handler chiamato da ElencoSpese quando viene aggiunta una nuova spesa
  const handleAdd = async (newItem) => {
    const newSpesa = await addSpesa(newItem)
    setSpese(prev => [newSpesa, ...prev])
  }

  // handler per eliminare una spesa (chiamato da ElencoSpese)
  const handleDelete = async (id) => {
    await deleteSpesa(id)
    setSpese(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div id="div_pagina">
      <main id="main_section" className="ml-64">
        <ElencoSpese className={showGrafici ? '' : 'expanded'} />
        {showGrafici && <ElencoGrafici id="grafici_section" listaSpese={spese} listaCategorie={categorie} />}
      </main>
    </div>
  )
}

export default Home
