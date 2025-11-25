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

  // handler chiamato da ElencoSpese quando viene aggiunta una nuova spesa
  const handleAdd = async (newItem) => {
    try {

      const record = {
        titolo: newItem.titolo,
        descrizione: newItem.descrizione || '',
        importo: newItem.importo,
        data: newItem.data,
      }

      console.log('Record da creare su PocketBase:', record);

      const created = await pb.collection('spese').create(record)

      setSpese(prev => [created, ...prev])
    } catch (err) {
      console.error('Errore nella creazione della spesa su PocketBase:', err)

    }
  }

  // handler per eliminare una spesa (chiamato da ElencoSpese)
  const handleDelete = async (id) => {
    try {
      await pb.collection('spese').delete(id)
      setSpese(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Errore durante l\'eliminazione su PocketBase:', err)
      throw err
    }
  }

  return (
    <div id="div_pagina">

      <NavBar showGrafici={showGrafici} setShowGrafici={setShowGrafici} />


      <main id="main_section">
        <ElencoSpese className={showGrafici ? '' : 'expanded'} listaSpese={spese} onAdd={handleAdd} onDelete={handleDelete} />
        {showGrafici && <ElencoGrafici id="grafici_section" listaSpese={spese} />}
      </main>

      <footer id="app_footer" aria-hidden="true">
        {/* footer minimale */}
      </footer>
    </div>
  )
}

export default App
