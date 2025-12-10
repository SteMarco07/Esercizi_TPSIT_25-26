import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Login fallito')
    }
  }

  return (
    <div className="div_pagina">
      <main id="main_section" className="p-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <div className="text-6xl">👋</div>
            <h1 className="text-3xl font-bold mt-3">Benvenuto in <span className="text-primary">Spese Tracker</span></h1>
            <p className="text-base-content/70 mt-2">Accedi per gestire le tue spese, categorie e visualizzare grafici personali.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-200 shadow-xl p-6 carta">
              <h2 className="text-xl font-bold mb-4">Accesso</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input className="input input-bordered w-full" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                {error && <div className="text-error">{error}</div>}
                <div>
                  <button className="btn btn-primary w-full" type="submit">Accedi</button>
                </div>
              </form>
            </div>

            <div className="card bg-base-100 shadow-md p-6 flex flex-col justify-center">
              <h3 className="text-lg font-semibold">Nuovo qui?</h3>
              <p className="mt-3 text-sm text-base-content/70">Crea un account per iniziare a tracciare le tue spese.</p>
              <div className="mt-4">
                <ul className="list-disc list-inside text-sm text-base-content/70">
                  <li>Gestisci le spese personali</li>
                  <li>Filtri e report</li>
                  <li>Visualizza grafici e statistiche</li>
                </ul>
              </div>

              <div className="mt-6">
                <button className="btn btn-outline w-full" onClick={() => navigate('/signup')}>Registrati</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

