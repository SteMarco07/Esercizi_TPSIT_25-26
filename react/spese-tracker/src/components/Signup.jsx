import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
  const navigate = useNavigate()

  return (
    <div className="div_pagina">
      <main id="main_section" className="p-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <div className="text-6xl">📝</div>
            <h1 className="text-3xl font-bold mt-3">Crea un account in <span className="text-primary">Spese Tracker</span></h1>
            <p className="text-base-content/70 mt-2">Compila il modulo per registrarti e iniziare a tracciare le tue spese.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-200 shadow-xl p-6 carta">
              <h2 className="text-xl font-bold mb-4">Registrazione</h2>
              <RegisterForm />
            </div>

            <div className="card bg-base-100 shadow-md p-6 flex flex-col justify-center">
              <h3 className="text-lg font-semibold">Hai già un account?</h3>
              <p className="mt-3 text-sm text-base-content/70">Se hai già un account, effettua l'accesso dalla pagina di login.</p>
              <div className="mt-6">
                <button className="btn btn-outline w-full" onClick={() => navigate('/login')}>Vai al login</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function RegisterForm() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleRegister = async (e) => {
    e?.preventDefault()
    setError(null)
    setSuccess(null)
    if (!email || !password || !passwordConfirm) {
      setError('Compila tutti i campi')
      return
    }
    if (password !== passwordConfirm) {
      setError('Le password non corrispondono')
      return
    }
    try {
      await signup({ email, password, passwordConfirm, name })
      setSuccess('Registrazione completata. Reindirizzamento in corso...')
      // navigate to home after successful signup
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Registrazione fallita')
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-3 mt-3">
      <input className="input input-bordered w-full" placeholder="Nome (opzionale)" value={name} onChange={e => setName(e.target.value)} />
      <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input className="input input-bordered w-full" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input className="input input-bordered w-full" placeholder="Conferma Password" type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required />
      {error && <div className="text-error">{error}</div>}
      {success && <div className="text-success">{success}</div>}
      <button className="btn btn-primary w-full" type="submit">Crea account</button>
    </form>
  )
}
