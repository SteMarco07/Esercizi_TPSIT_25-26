import { useState, useEffect } from 'react'
import PocketBase from 'pocketbase'
import './App.css'
import NavBar from './components/NavBar'
import ElencoSpese from './components/ElencoSpese'
import ElencoGrafici from './components/ElencoGrafici'

const pb = new PocketBase('http://127.0.0.1:8090');


function App() {
  const [showGrafici, setShowGrafici] = useState(true)

  const [spese, setSpese] = useState([])

  useEffect(() => {
    async function getSpese() {
      try {
        const listSpese = await pb.collection('spese').getFullList();
        console.log(listSpese);
        setSpese(listSpese);
      } catch (error) {
        console.error('Errore nel caricamento delle spese:', error);
      }
    }
    getSpese();
    console.log(spese)
  }, [])

  return (
    <div id="div_pagina">

      <NavBar showGrafici={showGrafici} setShowGrafici={setShowGrafici} />


      <main id="main_section">
        <ElencoSpese className={showGrafici ? '' : 'expanded'} listaSpese={spese}/>
        {showGrafici && <ElencoGrafici id="grafici_section" />}
      </main>

      <footer id="app_footer" aria-hidden="true">
        {/* footer minimale */}
      </footer>
    </div>
  )
}

export default App
