import { useState } from 'react'
import pb from '../pocketbase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Try common PocketBase auth methods for compatibility
      if (pb?.collection && typeof pb.collection === 'function' && pb.collection('users')?.authWithPassword) {
        await pb.collection('users').authWithPassword(email, password)
      } else if (pb?.users?.authViaEmail) {
        // alternative API shape
        await pb.users.authViaEmail({ email, password })
      } else if (pb?.authWithPassword) {
        await pb.authWithPassword(email, password)
      } else {
        // final attempt (may throw if API differs)
        await pb.collection('users').authWithPassword(email, password)
      }

      if (typeof onLogin === 'function') onLogin()
    } catch (err) {
      // PocketBase errors often have .data.message
      const message = err?.data?.message || err?.message || 'Errore durante il login'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-card">
      <h2>Accedi</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label className="login-label">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
        </label>

        <label className="login-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </label>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Accedi...' : 'Accedi'}
        </button>
      </form>
    </div>
  )
}
