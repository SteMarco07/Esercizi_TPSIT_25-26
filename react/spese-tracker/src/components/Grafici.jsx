import React from 'react'

export default function NavBar({ showGrafici, setShowGrafici }) {
  return (
    <section className={`panel panel-elenco ${className || ''}`} aria-labelledby="elenco_title">
      <h2 id="elenco_title">Elenco</h2>
      <div className="panel-body" aria-live="polite">
        <ul>
          <li>Elemento 1</li>
          <li>Elemento 2</li>
          <li>Elemento 3</li>
        </ul>
      </div>
    </section>
  )
}