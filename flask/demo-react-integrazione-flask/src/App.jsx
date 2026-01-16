import { use, useEffect, useState } from 'react'
import FormAggiunta from './FormAggiunta.jsx'

// Nuovo componente Card
function Card({ persona }) {
  return (
    <div style={{
      width: '300px',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      margin: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}>
      <h3 style={{
        margin: '0 0 10px 0',
        fontSize: '1.5em',
        color: '#333',
        fontWeight: 'bold'
      }}>{persona.name + ' ' + persona.last_name || 'Nome non disponibile'}</h3>
      <p style={{
        margin: '5px 0',
        color: '#666'
      }}>{"Email: " + (persona.email || 'Email non disponibile')}</p>
      <p style={{
        margin: '5px 0',
        color: '#666'
      }}>{"Indirizzo: " + (persona.address || 'Indirizzo non disponibile')}</p>
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

  const handleSubmit = (e, data) => {
    e.preventDefault()
    fetch('http://127.0.0.1:11000/persone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    console.log('Dati da inviare:', JSON.stringify(data))

    setData(prevData => [...prevData, data])
  }
        

  return (
    <>
      <div style={{
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <h1 style={{
          fontSize: '2.5em',
          textAlign: 'center',
          marginBottom: '40px',
          color: '#333',
          fontWeight: 'bold'
        }}>Elenco Persone</h1>
        <FormAggiunta handleSubmit={handleSubmit} />
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {data.map((persona, index) => (
            <Card key={index} persona={persona} />
          ))}
        </div>
      </div>
    </>
  )
}

export default App
