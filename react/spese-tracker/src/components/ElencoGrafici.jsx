import React, { useState, useEffect } from 'react'
import '../App.css'
import './Elemento.css'
import SummaryCard from './Graphics/SummaryCard'
import CalendarChart from './Graphics/CalendarChart'
import CategoryYearBar from './Graphics/CategoryYearBar'
import TimeSeriesLine from './Graphics/TimeSeriesLine'
import CategorySharePie from './Graphics/CategorySharePie'
import { getSpese, getCategorie } from '../services/pocketbaseService'

export default function ElencoGrafici() {
  const [listaSpese, setListaSpese] = useState([])
  const [categorie, setCategorie] = useState([])

  const formatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

  useEffect(() => {
    let mounted = true
    async function fetchAll() {
      try {
        const [s, c] = await Promise.all([getSpese(), getCategorie()])
        // ensure items have categoriaNome (service already enriches but keep safe)
        const sorted = [...(s || [])].sort((a, b) => (b?.data ? Date.parse(b.data) : 0) - (a?.data ? Date.parse(a.data) : 0))
        const enriched = (sorted || []).map(it => ({ ...it, categoriaNome: it.categoriaNome || (it.expand?.categoria?.nome) || '' }))
        if (!mounted) return
        setListaSpese(enriched)
        setCategorie(c || [])
      } catch (err) {
        console.error('Errore nel caricamento delle spese/categorie (ElencoGrafici):', err)
      }
    }
    fetchAll()
    return () => { mounted = false }
  }, [])

  return (<>
    <div className="div_pagina">
      <main id="main_section" className="ml-64 p-4 flex flex-col">

        <div className="flex justify-between items-center mb-4 w-full">
          <h1 className="text-2xl font-bold">DashBoard</h1>
        </div>

        <div className="flex-1 w-full" >
          <SummaryCard listaSpese={listaSpese} formatter={formatter} />
        </div>

        <div className="w-full overflow-y-auto" style={{ maxHeight: "70vh" }} aria-live="polite">

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

            <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" style={{ minHeight: 340 }}>
              <h3>Ripartizione per categoria</h3>
              <CategorySharePie listaSpese={listaSpese} formatter={formatter} />
            </div>

            <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" style={{ minHeight: 340 }}>
              <h3>Calendario delle spese</h3>
              <CalendarChart listaSpese={listaSpese} formatter={formatter} />
            </div>

            <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" style={{ minHeight: 340  }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Andamento temporale</h3>
              <TimeSeriesLine listaSpese={listaSpese} formatter={formatter} />
            </div>

            <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" style={{ minHeight: 340 }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Spesa per categoria e anno</h3>
              <CategoryYearBar listaSpese={listaSpese} formatter={formatter} />
            </div>

          </div>

        </div>

      </main>
    </div >
  </>
  )
}
