import React from 'react'

export default function NavBar({ showGrafici, setShowGrafici }) {
  return (
    <section id={id} className="panel panel-grafici" aria-labelledby="grafici_title">
      <h2 id="grafici_title">Grafici</h2>
      <div className="panel-body" aria-live="polite">
        {/* area placeholder per i grafici */}
      </div>
    </section>
  )
}