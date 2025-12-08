import { useEffect, useState } from 'react'
import pb from '../pocketbase'

export default function Dashboard({ user, onLogout }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newTesto, setNewTesto] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [createSuccess, setCreateSuccess] = useState(false)

  const collectionName = 'test_autenticazione'

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const ownerId = user?.id || pb?.authStore?.model?.id
      if (!ownerId) throw new Error('Utente non autenticato')

      // Diagnostics
      // eslint-disable-next-line no-console
      console.log('[Dashboard] ownerId:', ownerId)
      // eslint-disable-next-line no-console
      console.log('[Dashboard] pb.authStore.model:', pb?.authStore?.model)

      let records = []

      const filterEq = `id_utente = \"${ownerId}\"`
      const filterIn = `\"${ownerId}\" in id_utente`
      const filterUserEq = `user = \"${ownerId}\"`
      const filterUserIdEq = `user.id = \"${ownerId}\"`
      const filterUserIn = `\"${ownerId}\" in user`

      async function getRecordsWithFilter(filter) {
        // Try various SDK shapes and variations for getFullList/getList
        // 1) collection.getList(page, perPage, { filter })
        if (pb?.collection && typeof pb.collection === 'function' && pb.collection(collectionName)?.getList) {
          const res = await pb.collection(collectionName).getList(1, 50, { filter })
          return res?.items ?? res
        }

        // 2) records.getList(collection, page, perPage, { filter })
        if (pb?.records && typeof pb.records.getList === 'function') {
          const res = await pb.records.getList(collectionName, 1, 50, { filter })
          return res?.items ?? res
        }

        // 3) collection.getFullList({ filter }) or collection.getFullList(filter)
        if (pb?.collection && pb.collection(collectionName)?.getFullList) {
          try {
            const res = await pb.collection(collectionName).getFullList({ filter })
            return res
          } catch (e) {
            // try alternative signature
            const res2 = await pb.collection(collectionName).getFullList(filter)
            return res2
          }
        }

        throw new Error("PocketBase client non compatibile: controlla l'API client")
      }

      // Try several filter variants (order: equality on id_utente, in on id_utente,
      // relation `user` equality, `user.id` equality, and `in` on user relation)
      const filtersToTry = [filterEq, filterIn, filterUserEq, filterUserIdEq, filterUserIn]

      for (const f of filtersToTry) {
        try {
          // eslint-disable-next-line no-console
          console.log('[Dashboard] trying filter:', f)
          const res = await getRecordsWithFilter(f)
          if (res && Array.isArray(res) && res.length > 0) {
            records = res
            // eslint-disable-next-line no-console
            console.log('[Dashboard] got records with filter:', f)
            break
          }
          // if non-array response (some SDK shapes), accept truthy res
          if (res && !Array.isArray(res)) {
            records = res
            // eslint-disable-next-line no-console
            console.log('[Dashboard] got non-array records with filter:', f)
            break
          }
        } catch (errFilter) {
          // eslint-disable-next-line no-console
          console.warn('[Dashboard] filter failed:', f, errFilter)
          // try next filter
        }
      }

      // Diagnostics
      // eslint-disable-next-line no-console
      console.log('[Dashboard] raw records:', records)

      setItems(records || [])
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Errore durante il recupero dei dati'
      // eslint-disable-next-line no-console
      console.error('[Dashboard] fetch error:', err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  async function handleCreate(e) {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError(null)
    setCreateSuccess(false)
    try {
      const ownerId = user?.id || pb?.authStore?.model?.id
      if (!ownerId) throw new Error('Utente non autenticato')

      const payload = {
        testo: newTesto,
        user: ownerId,
      }

      // try create via typical SDK
      let created
      if (pb?.collection && typeof pb.collection === 'function' && pb.collection(collectionName)?.create) {
        created = await pb.collection(collectionName).create(payload)
      } else if (pb?.records && typeof pb.records.create === 'function') {
        created = await pb.records.create(collectionName, payload)
      } else {
        throw new Error("PocketBase client non compatibile: create non disponibile")
      }

      // clear inputs and refresh
      setNewTesto('')
      setCreateSuccess(true)
      await fetchData()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Dashboard] create error:', err)
      setCreateError(err?.data?.message || err?.message || 'Errore durante la creazione')
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <h2>Benvenuto, {user?.email || user?.username || 'utente'}</h2>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </header>

      <main className="dashboard-main">
        <section className="user-info">
          <h3>Informazioni utente</h3>
          <pre className="user-json">{JSON.stringify(user, null, 2)}</pre>
        </section>

        <section className="data-section">
          <h3>Dati dalla collection</h3>

          {loading && <div>Caricamento dati...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && !error && (
            <>
              <ul className="data-list">
                {items.length === 0 && <li>Nessun record trovato</li>}
                {items.map((it) => (
                  <li key={it.id} className="data-item">
                    <strong>{it.testo ?? it.title ?? `ID: ${it.id}`}</strong>
                    <div className="small">{it.testo ?? it.description ?? it.text ?? null}</div>
                    <pre className="small-json">{JSON.stringify(it, null, 2)}</pre>
                  </li>
                ))}
              </ul>

              <div className="create-section">
                <h4>Crea nuovo elemento</h4>
                <form onSubmit={handleCreate} className="create-form">
                  <label>
                    Testo
                    <textarea
                      value={newTesto}
                      onChange={(e) => setNewTesto(e.target.value)}
                      required
                      className="textarea"
                    />
                  </label>

                  {createError && <div className="error">{createError}</div>}
                  {createSuccess && <div className="success">Elemento creato con successo</div>}

                  <button type="submit" className="btn" disabled={createLoading}>
                    {createLoading ? 'Creazione...' : 'Crea'}
                  </button>
                </form>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
