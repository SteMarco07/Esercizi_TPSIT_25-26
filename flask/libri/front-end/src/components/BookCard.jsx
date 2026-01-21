import React, { useState } from 'react'
import { useStore } from '../store.jsx'

export default function BookCard({ book }) {
  const deleteResource = useStore(state => state.deleteResource)
  const [showModal, setShowModal] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleDelete = async () => {
    try {
      setBusy(true)
      await deleteResource(book.id)
      setShowModal(false)
    } catch (e) {
      // basic user feedback
      alert('Errore eliminazione: ' + (e.message || e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300">
        <div className="card-body">
          <h2 className="card-title">{book.titolo}</h2>
          <p className="text-sm">{book.autore}</p>
          <p className="text-sm">{book.editore} • {book.genere} • {book.anno}</p>
          <div className="card-actions justify-between">
            <div className="badge badge-outline">ISBN: {book.isbn}</div>
            <button className="btn btn-error btn-sm" onClick={() => setShowModal(true)}>Elimina</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={`modal modal-open`}> 
          <div className="modal-box">
            <h3 className="font-bold text-lg">Conferma eliminazione</h3>
            <p className="py-4">Sei sicuro di voler eliminare "{book.titolo}"?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)} disabled={busy}>Annulla</button>
              <button className="btn btn-error" onClick={handleDelete} disabled={busy}>
                {busy ? 'Eliminazione...' : 'Elimina'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
