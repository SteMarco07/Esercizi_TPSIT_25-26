import React, { useState } from 'react'
import { useStore } from '../store.jsx'

export default function BookCard({ book }) {
  const deleteResource = useStore(state => state.deleteResource)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [editable, setEditable] = useState(false)
  const [busy, setBusy] = useState(false)
  const [titolo, setTitolo] = useState(book.titolo)
  const [autore, setAutore] = useState(book.autore)
  const [editore, setEditore] = useState(book.editore)
  const [genere, setGenere] = useState(book.genere)
  const [anno, setAnno] = useState(book.anno)
  const [isbn, setIsbn] = useState(book.isbn)

  const handleDelete = async () => {
    try {
      setBusy(true)
      await deleteResource(book.id)
      setShowModalDelete(false)
    } catch (e) {
      // basic user feedback
      alert('Errore eliminazione: ' + (e.message || e))
    } finally {
      setBusy(false)
    }
  }

  const handleSave = async () => {
    // Implementa la logica di salvataggio delle modifiche qui
  }

  return (
    <>
      <div className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300" onClick={() => setShowModalInfo(true)}>
        <div className="card-body">
          <h2 className="card-title">{titolo}</h2>
          <p className="text-sm">{autore}</p>
          <p className="text-sm">{editore} • {genere} • {anno}</p>
          <div className="card-actions justify-between">
            <div className="badge badge-outline">ISBN: {isbn}</div>
            <button className="btn btn-error btn-sm" onClick={() => setShowModalDelete(true)}>Elimina</button>
          </div>
        </div>
      </div>

      {showModalDelete && (
        <div className={`modal modal-open`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Conferma eliminazione</h3>
            <p className="py-4">Sei sicuro di voler eliminare "{titolo}"?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModalDelete(false)} disabled={busy}>Annulla</button>
              <button className="btn btn-error" onClick={handleDelete} disabled={busy}>
                {busy ? 'Eliminazione...' : 'Elimina'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalInfo && (
        <div className={`modal modal-open`} onClick={() => setShowModalInfo(false)}>
          <div className="modal-box w-11/12 max-w-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-2xl text-center mb-6">Modifica Libro</h3>

            <div className="grid grid-cols-1 gap-3">
              {/* Campo del titolo */}
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Titolo</span></label>
                <input type="text" placeholder="Titolo del libro" className="input input-bordered w-full" value={titolo} onChange={(e) => setTitolo(e.target.value)} disabled={!editable} />
              </div>
              {/* Campo dell'autore */}
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Autore</span></label>
                <input type="text" placeholder="Nome Autore" className="input input-bordered w-full" value={autore} onChange={(e) => setAutore(e.target.value)} disabled={!editable} />
              </div>
              <div className="flex gap-5">
                {/* Campo dell'editore */}
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-semibold">Editore</span></label>
                  <input type="text" placeholder="Casa Editrice" className="input input-bordered w-full" value={editore} onChange={(e) => setEditore(e.target.value)} disabled={!editable} />
                </div>
                {/* Campo del genere */}
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-semibold">Genere</span></label>
                  <input type="text" placeholder="Genere" className="input input-bordered w-full" value={genere} onChange={(e) => setGenere(e.target.value)} disabled={!editable} />
                </div>

              </div>
              <div className="flex gap-5">
                {/* Campo della descrizione */}
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-semibold">Anno</span></label>
                  <input type="number" placeholder="Anno di pubblicazione" className="input input-bordered w-full" value={anno} onChange={(e) => setAnno(e.target.value)} disabled={!editable} />
                </div>
                {/* Campo dell'ISBN */}
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-semibold">ISBN</span></label>
                  <input type="text" placeholder="Codice ISBN" className="input input-bordered w-full" value={isbn} onChange={(e) => setIsbn(e.target.value)} disabled={!editable} />
                </div>
              </div>

            </div>

            <div className="modal-action mt-8">
              <button className="btn btn-ghost" onClick={() => setShowModalInfo(false)}>Annulla</button>
              <button className="btn btn-primary" onClick={() => setEditable(!editable)}>
                {editable ? 'Smetti di modificare' : 'Modifica'}
              </button>
              {editable &&
                <button className="btn btn-success" >Salva</button>
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}
