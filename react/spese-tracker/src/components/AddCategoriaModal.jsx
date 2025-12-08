import React, { useState } from 'react'
import { addCategoria } from '../services/pocketbaseService'

export default function AddCategoriaModal({ onCreated }) {
  const [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [descrizione, setDescrizione] = useState('')
  const [colore, setColore] = useState('#ffffff')

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const handleAdd = async () => {
    if (!nome.trim()) return
    try {
      const created = await addCategoria({ nome: nome.trim(), descrizione, colore })
      if (typeof onCreated === 'function') onCreated(created)
      setNome('')
      setDescrizione('')
      setColore('#ffffff')
      close()
    } catch (err) {
      console.error('Errore creazione categoria:', err)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <button className="btn btn-primary" onClick={open}>+</button>
      </div>

      {isOpen && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Aggiungi Categoria</h3>
            <div className="py-4 space-y-4">
              <div className="flex gap-4 items-center">
                <input type="text" placeholder="Nome della categoria" className="input input-bordered flex-1" value={nome} onChange={e => setNome(e.target.value)} required />
                <div className="flex items-center gap-2">
                  <label className="text-sm">Colore</label>
                  <input type="color" value={colore} onChange={e => setColore(e.target.value)} className="w-10 h-10 p-0 border rounded" />
                </div>
              </div>
              <div>
                <textarea placeholder="Breve descrizione (opzionale)" className="textarea textarea-bordered w-full" value={descrizione} onChange={e => setDescrizione(e.target.value)} rows="3" />
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={close}>Annulla</button>
              <button className="btn btn-primary" onClick={handleAdd}>Salva</button>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
