import React, { useState } from 'react'
import { useStore } from '../store.jsx'

export default function BookCard({ book }) {
  const deleteResource = useStore(state => state.deleteResource)
  const updateResource = useStore(state => state.updateResource)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [editable, setEditable] = useState(false)
  const [busy, setBusy] = useState(false)
  const [bookData, setBookData] = useState(book)
  const [bookDataTmp, setBookDataTmp] = useState(book)

  const handleDelete = async () => {
    try {
      setBusy(true)
      await deleteResource(bookData.id)
      setShowModalDelete(false)
    } catch (e) {
      // basic user feedback
      alert('Errore eliminazione: ' + (e.message || e))
    } finally {
      setBusy(false)
    }
  }

  const generateLibro = () => {
    return {
      "id": bookData.id,
      "titolo": bookData.titolo,
      "autore": bookData.autore,
      "editore": bookData.editore,
      "genere": bookData.genere,
      "anno": bookData.anno,
      "isbn": bookData.isbn
    }
  }

  const handleSave = async () => {
    try {
      setBusy(true)
      await updateResource(generateLibro())
    } catch (e) {
      console.log('Errore modifica: ' + (e.message || e))
    } finally {
      setBookData(bookDataTmp)
      setBusy(false)
    }

  }

  return (
    <>
      <div className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300" onClick={() => setShowModalInfo(true)}>
        <div className="card-body">
          <h2 className="card-title">{bookData.titolo}</h2>
          <p className="text-sm">{bookData.autore}</p>
          <p className="text-sm">{bookData.editore} • {bookData.genere} • {bookData.anno}</p>
          <div className="card-actions justify-between">
            <div className="badge badge-outline">ISBN: {bookData.isbn}</div>
            <button className="btn btn-error btn-sm" onClick={() => setShowModalDelete(true)}>Elimina</button>
          </div>
        </div>
      </div>

      {showModalDelete && (
        <div className={`modal modal-open`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Conferma eliminazione</h3>
            <p className="py-4">Sei sicuro di voler eliminare "{bookData.titolo}"?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => (setShowModalDelete(false), setShowModalInfo(false))} disabled={busy}>Annulla</button>
              <button className="btn btn-error" onClick={handleDelete} disabled={busy}>
                {busy ? 'Eliminazione...' : 'Elimina'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalInfo && !showModalDelete && (
        <div className={`modal modal-open`} onClick={() => setShowModalInfo(false)}>
          <div className="modal-box w-11/12 max-w-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-2xl text-center mb-6">{editable ? 'Modifica Libro' : 'Dettagli Libro'}</h3>

            <div className="grid grid-cols-1 gap-3">
              {/* Campo del titolo */}
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Titolo</span></label>
                <input type="text" placeholder="Titolo del libro" className="input input-bordered w-full" value={bookDataTmp.titolo} onChange={(e) => setBookDataTmp({ ...bookDataTmp, titolo: e.target.value })} disabled={!editable} />
              </div>
              {/* Campo dell'autore */}
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Autore</span></label>
                <input type="text" placeholder="Nome Autore" className="input input-bordered w-full" value={bookDataTmp.autore} onChange={(e) => setBookDataTmp({ ...bookDataTmp, autore: e.target.value })} disabled={!editable} />
              </div>
              <div className="flex gap-5">
                {/* Campo dell'editore */}
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-semibold">Editore</span></label>
                  <input type="text" placeholder="Casa Editrice" className="input input-bordered w-full" value={bookDataTmp.editore} onChange={(e) => setBookDataTmp({ ...bookDataTmp, editore: e.target.value })} disabled={!editable} />
                </div>
                {/* Campo del genere */}
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-semibold">Genere</span></label>
                  <input type="text" placeholder="Genere" className="input input-bordered w-full" value={bookDataTmp.genere} onChange={(e) => setBookDataTmp({ ...bookDataTmp, genere: e.target.value })} disabled={!editable} />
                </div>

              </div>
              <div className="flex gap-5">
                {/* Campo della descrizione */}
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-semibold">Anno</span></label>
                  <input type="number" placeholder="Anno di pubblicazione" className="input input-bordered w-full" value={bookDataTmp.anno} onChange={(e) => setBookDataTmp({ ...bookDataTmp, anno: e.target.value })} disabled={!editable} />
                </div>
                {/* Campo dell'ISBN */}
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-semibold">ISBN</span></label>
                  <input type="text" placeholder="Codice ISBN" className="input input-bordered w-full" value={bookDataTmp.isbn} onChange={(e) => setBookDataTmp({ ...bookDataTmp, isbn: e.target.value })} disabled={!editable} />
                </div>
              </div>

            </div>

            <div className="modal-action mt-8">
              <button className="btn btn-ghost" onClick={() => setShowModalInfo(false)}>Chiudi</button>
              {!editable &&
                <button className="btn btn-primary" onClick={() => setEditable(true)}>Modifica</button>
              }
              {editable &&
                <>
                  <button className="btn btn-primary" onClick={() => (setEditable(false), setBookDataTmp(bookData))}>Annulla Modifica</button>
                  <button className="btn btn-success" onClick={() => (setEditable(false),handleSave())}>Salva</button>
                </>
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}
