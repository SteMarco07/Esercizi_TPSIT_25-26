import { useState, useEffect, useMemo } from 'react'
import PocketBase from 'pocketbase'
import './App.css'
import NavBar from './components/NavBar'
import ElencoSpese from './components/ElencoSpese'
import ElencoGrafici from './components/ElencoGrafici'

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



  
  // handler chiamato da ElencoSpese quando viene aggiunta una nuova spesa
  const handleAdd = async (newItem) => {
    try {

      const record = {
        titolo: newItem.titolo,
        descrizione: newItem.descrizione || '',
        importo: newItem.importo,
        data: newItem.data,
      }

      // include category id if provided (try both keys for compatibility)
      if (newItem.categoriaId) {
        record.categoria = newItem.categoriaId
        record.categoriaId = newItem.categoriaId
      }

      const created = await pb.collection('spese').create(record)
      // fetch the created record with expand to get categoria object
      try {
        const createdExpanded = await pb.collection('spese').getOne(created.id, { expand: 'categoria' })
        const enrichedCreated = { ...createdExpanded, categoriaNome: createdExpanded.expand?.categoria?.nome || createdExpanded.categoria || '' }
        setSpese(prev => [enrichedCreated, ...prev])
      } catch (err) {
        // fallback: if expand fetch fails, add the created raw record
        setSpese(prev => [created, ...prev])
      }
    } catch (err) {
      console.error('Errore nella creazione della spesa su PocketBase:', err)

    }
  }

  // handler per eliminare una spesa (chiamato da ElencoSpese)
  const handleDelete = async (id) => {
    try {
      await pb.collection('spese').delete(id)
      setSpese(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Errore durante l\'eliminazione su PocketBase:', err)
      throw err
    }
  }

  return (
    <div id="div_pagina">

      <NavBar theme={theme} setTheme={setTheme} showGrafici={showGrafici} setShowGrafici={setShowGrafici} />


      <main id="main_section">
        <ElencoSpese className={showGrafici ? '' : 'expanded'} listaSpese={spese} listaCategorie={categorie} onAdd={handleAdd} onDelete={handleDelete} />
        {showGrafici && <ElencoGrafici id="grafici_section" listaSpese={spese} listaCategorie={categorie} />}
      </main>

    </div>
  )
}

export default App
