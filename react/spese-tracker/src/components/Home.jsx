import { useState, useEffect } from 'react'
// ElencoGrafici is not used here; charts are rendered inline
import Elemento from './Elemento'
import AddSpesaModal from './AddSpesaModal'
import AddCategoriaModal from './AddCategoriaModal'
import { getSpese, getCategorie, deleteSpesa } from '../services/pocketbaseService'
import { resolveCategoriaNome, resolveCategoriaColore } from '../utils/categoriaUtils'
import TimeSeriesLine from './Graphics/TimeSeriesLine'

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



  // handler per eliminare una spesa (chiamato da ElencoSpese)
  const handleDelete = async (id) => {
    await deleteSpesa(id)
    setSpese(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="div_pagina">
      <main id="main_section" className="ml-64 p-4 flex flex-col gap-4">
        {/* Row 1: two columns */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full">


          <div className="card bg-base-200 shadow-xl p-4 carta">
            <h3 className="font-bold">Elenco categorie</h3>
            <div className="mt-3">
              {(categorie || []).map(cat => (
                <div key={cat.id} className="flex items-center gap-3 mb-2">
                  <div style={{ width: 18, height: 18, borderRadius: 6, background: cat.colore || '#999' }} />
                  <div>{cat.nome}</div>
                </div>
              ))}
            </div>
          </div>


          <div className="card bg-base-200 shadow-xl p-4 carta">
            <h3 className="font-bold">Ultime spese</h3>
            <div className="overflow-x-auto mt-3">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Titolo</th>
                    <th>Data</th>
                    <th>Importo</th>
                  </tr>
                </thead>
                <tbody>
                  {(spese || []).slice().sort((a, b) => (b?.data ? Date.parse(b.data) : 0) - (a?.data ? Date.parse(a.data) : 0)).slice(0, 3).map(s => (
                    <Elemento
                      key={s.id}
                      id={s.id}
                      titolo={s.titolo}
                      descrizione={s.descrizione}
                      data={s.data}
                      costo={Number(s.importo ?? s.costo ?? 0) || 0}
                      categoriaNome={resolveCategoriaNome(s)}
                      categoriaColore={resolveCategoriaColore(s)}
                      onRequestDelete={handleDelete}
                      asRow={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>


          </div>

        </div>

        {/* Row 2: quick actions (two buttons on the same row) */}

        <div className="card bg-base-200 shadow-xl p-4 w-full carta">
          <h3 className="font-bold">Aggiunte rapide</h3>
          <div className="mt-3 grid grid-cols-2 gap-4 items-start">
            <div className="p-3 border rounded-md bg-base-100 flex flex-col dettaglio">
              <h4 className="font-semibold mb-2">Aggiunta rapida spesa</h4>
              <div>
                <AddSpesaModal categorie={categorie} onCreated={(created) => setSpese(prev => [created, ...(prev || [])])} />
              </div>
            </div>

            <div className="p-3 border rounded-md bg-base-100 flex flex-col dettaglio">
              <h4 className="font-semibold mb-2">Aggiunta rapida categoria</h4>
              <div>
                <AddCategoriaModal onCreated={(created) => setCategorie(prev => [created, ...(prev || [])])} />
              </div>
            </div>
          </div>
        </div>


        {/* Row 3: grafici (full width) */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full">
          <div className="card bg-base-200 shadow-xl p-4 carta">
            <h3 className="font-bold">Spese - Giorno</h3>
            <TimeSeriesLine listaSpese={spese} rangeOverride="day" height={280} formatter={new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })} />
          </div>

          <div className="card bg-base-200 shadow-xl p-4 carta">
            <h3 className="font-bold">Spese - Mese</h3>
            <TimeSeriesLine listaSpese={spese} rangeOverride="month" height={280} formatter={new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })} />
          </div>
        </div>

      </main>
    </div>
  )
}

export default Home
