import React, { useState, useEffect } from 'react'
import Elemento from './Elemento'

function AggiungiSpese({ list = [] }) {

    return list.map((element, pos) => (
        <Elemento
            key={pos}
            titolo={element.titolo}
            descrizione={element.descrizione}
            data={element.data}
            costo={element.importo}
            id={element.id}
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
                    <p className="py-4">Press ESC key or click the button below to close</p>

                    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                        <div>
                            <input name="titolo" value={form.titolo} onChange={handleChange} className="input input-bordered w-full" placeholder="Titolo" required />
                            {errors.titolo && <p className="text-error text-sm">{errors.titolo}</p>}
                        </div>

                        <div>
                            <textarea name="descrizione" value={form.descrizione} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Descrizione (opzionale)"></textarea>
                        </div>

                        <div>
                            <input name="costo" value={form.costo} onChange={handleChange} className="input input-bordered w-full" placeholder="Importo (es. 23.50)" inputMode="decimal" required />
                            {errors.costo && <p className="text-error text-sm">{errors.costo}</p>}
                        </div>

                        <div style={{flexDirection: 'row', display: 'flex', gap: '8px'}}>
                            <div style={{flex: 1}}>
                                <input type="date" name="data" value={form.data} onChange={handleChange} className="input input-bordered w-full" required />
                                {errors.data && <p className="text-error text-sm">{errors.data}</p>}
                            </div>
                            <div style={{flex: 1}}>
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

export default function ElencoSpese({ id, className, listaSpese = [], onAdd }) {

    const [localList, setLocalList] = useState(listaSpese)
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ titolo: '', descrizione: '', costo: '', data: '', ora: '' })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        setLocalList(listaSpese)
    }, [listaSpese])

    const openModal = () => setShowModal(true)
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
        if (!form.titolo || form.titolo.trim() === '') errs.titolo = 'Il titolo è obbligatorio.'
        if (!form.costo || form.costo.toString().trim() === '') errs.costo = 'L\'importo è obbligatorio.'
        else if (isNaN(Number(form.costo))) errs.costo = 'L\'importo deve essere un numero.'
        if (!form.data || form.data.trim() === '') errs.data = 'La data è obbligatoria.'
        if (!form.ora || form.ora.trim() === '') errs.ora = 'L\'ora è obbligatoria.'

        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }

        const titolo = form.titolo.trim()
        const descrizione = form.descrizione?.trim() || ''
        const costoNum = Number(form.costo)
        const costo = Number.isFinite(costoNum) ? costoNum : 0
        const data = `${form.data.trim()} ${form.ora.trim()}`

        const newItem = {
            id: Date.now().toString(),
            titolo,
            descrizione,
            importo: costo,
            data,
        }

        setLocalList(list => [newItem, ...list])
        // if parent wants to be notified, call onAdd if provided (keep existing behaviour)
        if (typeof onAdd === 'function') onAdd(newItem)
        closeModal()
    }

    return (
        <section id="elenco_section" className={`panel panel-elenco ${className || ''}`} aria-labelledby="elenco_title">
            <h2 id="elenco_title">Elenco Spese</h2>
            <FormModal form={form} handleChange={handleChange} handleSubmit={handleSubmit} closeModal={closeModal} errors={errors} />
            <div className="panel-body" aria-live="polite">
                <AggiungiSpese list={localList} />
            </div>
        </section>
    )
}
