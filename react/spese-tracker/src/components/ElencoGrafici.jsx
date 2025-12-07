import React from 'react'
import '../App.css'
import './Elemento.css'
import SummaryCard from './Graphics/SummaryCard'
import CalendarChart from './Graphics/CalendarChart'
import CategoryYearBar from './Graphics/CategoryYearBar'
import TimeSeriesLine from './Graphics/TimeSeriesLine'
import CategorySharePie from './Graphics/CategorySharePie'

export default function ElencoGrafici({ id, listaSpese = [] }) {
  const formatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

  return (
    <section id={id} className="panel panel-grafici" aria-labelledby="grafici_title">
      <h2 id="grafici_title">Analisi grafica delle spese</h2>
      <div className="panel-body" aria-live="polite">

        <div className="flex flex-col md:flex-row gap-4">
          <div style={{ flex: 1 }}>
            <SummaryCard listaSpese={listaSpese} formatter={formatter} />
          </div>
          <div style={{ flex: 1 }}>
            <CategorySharePie listaSpese={listaSpese} formatter={formatter} />
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl image-full scritta carta p-5">
          <h3>Calendario delle spese</h3>
          <CalendarChart listaSpese={listaSpese} formatter={formatter} />
        </div>

        <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" style={{ marginTop: 12 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Andamento temporale</h3>
          <TimeSeriesLine listaSpese={listaSpese} formatter={formatter} />
        </div>

        <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" style={{ marginTop: 12 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Spesa per categoria e anno</h3>
          <CategoryYearBar listaSpese={listaSpese} formatter={formatter} />
        </div>

      </div>
    </section>
  )
}
