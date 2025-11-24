import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import ElencoSpese from './components/ElencoSpese'
import ElencoGrafici from './components/ElencoGrafici'


function App() {
  const [showGrafici, setShowGrafici] = useState(true)

  return (
    <div id="div_pagina">

      <NavBar showGrafici={showGrafici} setShowGrafici={setShowGrafici} />


      <main id="main_section">
        <ElencoSpese className={showGrafici ? '' : 'expanded'} />
        {showGrafici && <ElencoGrafici id="grafici_section" />}
      </main>

      <footer id="app_footer" aria-hidden="true">
        {/* footer minimale */}
      </footer>
    </div>
  )
}

export default App
