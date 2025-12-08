import React, { useState, useEffect } from 'react'
import { addSpesa } from '../services/pocketbaseService'

export default function AddSpesaModal({ categorie = [], onCreated }) {
  const [isOpen, setIsOpen] = useState(false)
  const [titolo, setTitolo] = useState('')
  const [descrizione, setDescrizione] = useState('')
  const [costo, setCosto] = useState('')
  const [categoriaId, setCategoriaId] = useState(categorie?.[0]?.id || '')
  const [data, setData] = useState(new Date().toISOString().slice(0, 10))
  const [ora, setOra] = useState(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`)

  useEffect(() => {
    if (!categoriaId && categorie && categorie.length) setCategoriaId(categorie[0].id)
  }, [categorie])

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const handleAdd = async (e) => {
    e?.preventDefault()
    if (!titolo.trim()) return
    const importo = Number(costo) || 0
    let isoDate
    try {
      const [y, m, d] = (data || '').split('-').map(Number)
      const [hh, mm] = (ora || '00:00').split(':').map(Number)
      const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0)
      isoDate = dt.toISOString()
    } catch (err) {
      isoDate = new Date().toISOString()
    }

    const payload = {
      titolo: titolo.trim(),
      descrizione: descrizione.trim() || '',
      importo,
      data: isoDate,
      categoriaId: categoriaId || null,
    }

    try {
      const created = await addSpesa(payload)
      if (typeof onCreated === 'function') onCreated(created)
      setTitolo('')
      setDescrizione('')
      setCosto('')
      setCategoriaId(categorie?.[0]?.id || '')
      close()
    } catch (err) {
      console.error('Errore creazione spesa:', err)
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
            <h3 className="font-bold text-lg">Aggiungi Spesa</h3>
            <form className="py-4 space-y-3" onSubmit={handleAdd}>
              <div>
                <input name="titolo" value={titolo} onChange={e => setTitolo(e.target.value)} className="input input-bordered w-full" placeholder="Titolo" required />
              </div>
              <div>
                <textarea name="descrizione" value={descrizione} onChange={e => setDescrizione(e.target.value)} className="textarea textarea-bordered w-full" placeholder="Descrizione (opzionale)"></textarea>
              </div>
              <div>
                <input name="costo" value={costo} onChange={e => setCosto(e.target.value)} className="input input-bordered w-full" placeholder="Importo (es. 23.50)" inputMode="decimal" type="number" step="0.01" min="0" required />
              </div>
              <div>
                <label className="label p-0"><span className="label-text">Categoria</span></label>
                <select name="categoriaId" value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className="select select-bordered w-full">
                  <option value="">Nessuna categoria</option>
                  {(categorie || []).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="date" name="data" value={data} onChange={e => setData(e.target.value)} className="input input-bordered w-full" />
                <input type="time" name="ora" value={ora} onChange={e => setOra(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={close}>Annulla</button>
                <button type="submit" className="btn btn-primary">Aggiungi</button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  )
}
