import React, { useState, useEffect } from 'react'
import Elemento from './Elemento'

function AggiungiSpese({ list = [], onRequestDelete }) {

    return list.map((element, pos) => (
        <Elemento
            key={pos}
            titolo={element.titolo}
            descrizione={element.descrizione}
            data={element.data}
            costo={element.importo}
            id={element.id}
            onRequestDelete={onRequestDelete}
        />
    ));

}

function FormModal({ form, handleChange, handleSubmit, closeModal, errors = {} }) {
    return (
        <>
            <input type="text" placeholder="Aggiungi una spesa" className="input input-bordered w-full mb-4" onClick={() => document.getElementById('modal_aggiunta').showModal()} />

            <dialog id="modal_aggiunta" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Aggiungi una spesa</h3>

                    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                        <div>
                            <input name="titolo" value={form.titolo} onChange={handleChange} className="input input-bordered w-full" placeholder="Titolo" required />
                            {errors.titolo && <p className="text-error text-sm">{errors.titolo}</p>}
                        </div>

                        <div>
                            <textarea name="descrizione" value={form.descrizione} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Descrizione (opzionale)"></textarea>
                        </div>

                        <div>
                            <input name="costo" value={form.costo} onChange={handleChange} className="input input-bordered w-full" placeholder="Importo (es. 23.50)" inputMode="decimal" type="number" step="0.01" min="0" required />
                            {errors.costo && <p className="text-error text-sm">{errors.costo}</p>}
                        </div>

                        <div style={{ flexDirection: 'row', display: 'flex', gap: '8px' }}>
                            <div style={{ flex: 1 }}>
                                <input type="date" name="data" value={form.data} onChange={handleChange} className="input input-bordered w-full" required />
                                {errors.data && <p className="text-error text-sm">{errors.data}</p>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <input type="time" name="ora" value={form.ora} onChange={handleChange} className="input input-bordered w-full" required />
                                {errors.ora && <p className="text-error text-sm">{errors.ora}</p>}
                            </div>
                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => { closeModal(); document.getElementById('modal_aggiunta')?.close(); }}>Annulla</button>
                            <button type="submit" className="btn btn-primary">Aggiungi</button>
                        </div>
                    </form>

                </div>
            </dialog>
        </>
    )
}

function DeleteModal({ pendingDeleteId, setPendingDeleteId, setLocalList, onDelete }) {
    return (
        <dialog id="confirm_delete" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Conferma eliminazione</h3>
                <p className="py-4">Sei sicuro di voler eliminare questa spesa? Questa operazione non è reversibile.</p>
                <div className="modal-action">
                    <button className="btn" onClick={() => { setPendingDeleteId(null); document.getElementById('confirm_delete')?.close(); }}>Annulla</button>
                    <button className="btn btn-error" onClick={async () => {
                        const idToDelete = pendingDeleteId
                        try {
                            await onDelete(idToDelete)
                            setLocalList(prev => prev.filter(it => it.id !== idToDelete))
                        } catch (err) {
                            console.error('Eliminazione fallita:', err)
                        } finally {
                            setPendingDeleteId(null)
                            document.getElementById('confirm_delete')?.close()
                        }
                    }}>Elimina</button>
                </div>
            </div>
        </dialog>
    )
}

export default function ElencoSpese({ id, className, listaSpese = [], onAdd, onDelete }) {

    const [localList, setLocalList] = useState(listaSpese)
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ titolo: '', descrizione: '', costo: '', data: '', ora: '' })
    const [errors, setErrors] = useState({})
    const [pendingDeleteId, setPendingDeleteId] = useState(null)

    useEffect(() => {
        setLocalList(listaSpese)
    }, [listaSpese])

    const closeModal = () => {
        setShowModal(false)
        setForm({ titolo: '', descrizione: '', costo: '', data: '', ora: '' })
        setErrors({})
        document.getElementById('modal_aggiunta')?.close()
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = {}

        const titolo = form.titolo.trim()
        const descrizione = form.descrizione.trim() || ''
        const importo = Number(form.costo)

        if (!titolo || titolo === '') errs.titolo = 'Il titolo è obbligatorio.'
        if (!form.costo || form.costo.toString().trim() === '') errs.costo = 'L\'importo è obbligatorio.'
        else if (isNaN(importo)) errs.costo = 'L\'importo deve essere un numero.'
        else if (importo < 0) errs.costo = 'L\'importo non può essere negativo.'
        if (!form.data || form.data.trim() === '') errs.data = 'La data è obbligatoria.'
        if (!form.ora || form.ora.trim() === '') errs.ora = 'L\'ora è obbligatoria.'

        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }

        let data

        try {
            const [y, m, d] = form.data.trim().split('-').map(Number)
            const [hh, mm] = form.ora.trim().split(':').map(Number)
            const utcMs = Date.UTC(y, m - 1, d, hh || 0, mm || 0, 0, 0)
            // send proper ISO 8601 (RFC3339) timestamp expected by PocketBase
            data = new Date(utcMs).toISOString()
        } catch (err) {
            // fallback to an ISO-like string if parsing fails
            const datePart = form.data.trim()
            const timePart = form.ora.trim() || '00:00'
            data = `${datePart}T${timePart}:00.000Z`
        }

        const newItem = {
            titolo,
            descrizione,
            importo,
            data,
        }

        setLocalList(list => [newItem, ...list])

        if (typeof onAdd === 'function') {
            onAdd(newItem)
        }

        closeModal()
    }

    return (
        <section id="elenco_section" className={`panel panel-elenco ${className || ''}`} aria-labelledby="elenco_title">
            <h2 id="elenco_title">Elenco Spese</h2>
            <FormModal form={form} handleChange={handleChange} handleSubmit={handleSubmit} closeModal={closeModal} errors={errors} />
            <div className="panel-body" aria-live="polite">
                <AggiungiSpese list={localList} onRequestDelete={(id) => {
                    setPendingDeleteId(id)
                    // open the confirm dialog
                    setTimeout(() => document.getElementById('confirm_delete').showModal(), 0)
                }} />

                <DeleteModal pendingDeleteId={pendingDeleteId} setPendingDeleteId={setPendingDeleteId} setLocalList={setLocalList} onDelete={onDelete} />
            </div>
        </section>
    )
}
