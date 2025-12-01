import { useEffect, useState } from 'react'
import './App.css'
import pb from './pocketbase'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(pb?.authStore?.model ?? null)

  useEffect(() => {
    if (!pb) {
      console.error('PocketBase client non disponibile. Controlla src/pocketbase.js')
      return
    }

    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model)
    })
    // set initial
    setUser(pb.authStore.model)
    return () => unsubscribe()
  }, [])

  function handleLogout() {
    pb.authStore.clear()
    setUser(null)
  }

  return (
    <div className="app-root">
      {!user ? (
        <Login onLogin={() => setUser(pb.authStore.model)} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App