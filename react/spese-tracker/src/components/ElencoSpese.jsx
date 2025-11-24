import React from 'react'
import Elemento from './Elemento' 

export default function ElencoSpese({ id, className }) {
  return (
    <section id="elenco_section" className={`panel panel-elenco ${className || ''}`} aria-labelledby="elenco_title">
      <h2 id="elenco_title">Elenco Spese</h2>
      <div className="panel-body" aria-live="polite">
        <Elemento id="elemento_1" />
        <Elemento id="elemento_2" />
        <Elemento titolo="Spesa supermercato" descrizione="Pane, latte" costo={23.5} data={new Date('2025-11-24')} />
      </div>
    </section>
  )
}
