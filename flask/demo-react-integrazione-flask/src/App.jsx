import { use, useEffect, useState } from 'react'
import FormAggiunta from './FormAggiunta.jsx'

// Nuovo componente Card
function Card({ persona }) {
  return (
    <div style={{
      width: '250px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>{persona.name + ' ' + persona.last_name || 'Nome non disponibile'}</h3>
      <p>{"Email: " + (persona.email || 'Email non disponibile')}</p>
      <p>{"Indirizzo: " + (persona.addres || 'Indirizzo non disponibile')}</p>
      {/* Aggiungi altri campi se necessario */}
    </div>
  )
}

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:11000/persone')
      const json = await response.json()
      return json.data
    }

    fetchData().then(data => {
      setData(data)
    })
  }, [])

  useEffect(() => {
    console.log('Data aggiornata:', data)
  }, [data])

  return (
    <>
      <h1>Elenco Persone</h1>
      <FormAggiunta />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {data.map((persona, index) => (
          <Card key={index} persona={persona} />
        ))}
      </div>
    </>
  )
}

export default App
