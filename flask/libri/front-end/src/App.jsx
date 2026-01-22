import { useEffect } from 'react'
import './App.css'
import { useStore } from './store.jsx'
import BookCard from './components/BookCard'
import TopBar from './components/TopBar'

function App() {
  const { resources, isLoading, error, fetchResources } = useStore()

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  return (
    <div className="min-h-screen bg-base-200">
      <TopBar />

      <div className="container mx-auto p-6 pt-20">
        {isLoading && <p>Caricamento in corso...</p>}
        {error && <p className="text-error">Errore: {error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources && resources.length > 0 ? (
            resources.map((b) => (
              <BookCard book={b} key={b.id} />
            ))
          ) : (
            !isLoading && <p>Nessun libro trovato.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
