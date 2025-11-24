import React from 'react'

export default function ElencoGrafici({ id }) {
  return (
    <section id={id} className="panel panel-grafici" aria-labelledby="grafici_title">
      <h2 id="grafici_title">Analisi grafica delle spese</h2>
      <div className="panel-body" aria-live="polite">
        <p>Placeholder grafici — qui andranno i grafici o il componente Chart.</p>
      </div>
    </section>
  )
}
