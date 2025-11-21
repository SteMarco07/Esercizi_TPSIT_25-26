import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'


function Grafici({ id }) {
  return (
    <section id={id} className="panel panel-grafici" aria-labelledby="grafici_title">
      <h2 id="grafici_title">Grafici</h2>
      <div className="panel-body" aria-live="polite">
        {/* area placeholder per i grafici */}
      </div>
    </section>
  )
}

function Elenco({ className }) {
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



function App() {
  const [showGrafici, setShowGrafici] = useState(true)

  return (
    <div id="div_pagina">

      <NavBar showGrafici={showGrafici} setShowGrafici={setShowGrafici} />


      <main id="main_section">
        <Elenco className={showGrafici ? '' : 'expanded'} />
        {showGrafici && <Grafici id="grafici_section" />}
      </main>

      <footer id="app_footer" aria-hidden="true">
        {/* footer minimale */}
      </footer>
    </div>
  )
}

export default App
