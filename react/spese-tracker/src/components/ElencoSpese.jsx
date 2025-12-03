import React, { useState, useEffect, useMemo } from 'react'
import Elemento from './Elemento'

// helper: resolve category name from several possible shapes
const resolveCategoriaNome = (item, listaCategorie = []) => {
    if (!item) return ''
    if (item.categoriaNome) return item.categoriaNome
    if (item.expand && item.expand.categoria && (item.expand.categoria.nome || item.expand.categoria.name)) return item.expand.categoria.nome || item.expand.categoria.name
    if (item.categoria && typeof item.categoria === 'string') return item.categoria
    if (item.categoria && typeof item.categoria === 'object' && (item.categoria.nome || item.categoria.name)) return item.categoria.nome || item.categoria.name
    const id = item.categoriaId || item.categoria || item.categoryId || item.categoria_id || item._categoria
    if (id && listaCategorie && listaCategorie.length) {
        const found = listaCategorie.find(c => String(c.id) === String(id) || String(c._id) === String(id))
        if (found) return found.nome || found.name || ''
    }
    return ''
}

function AggiungiSpese({ list = [], categories = [], onRequestDelete }) {

    return list.map((element, pos) => {
        const nomeCat = resolveCategoriaNome(element, categories)
        return (
            <Elemento
                key={element.id ?? pos}
                titolo={element.titolo}
                descrizione={element.descrizione}
                data={element.data}
                costo={element.importo}
                id={element.id}
                categoriaNome={nomeCat}
                onRequestDelete={onRequestDelete}
            />
        )
    })

}

function FormModal({ form, handleChange, handleSubmit, closeModal, errors = {}, openModal, categories = [] }) {
    return (
        <>
            <input type="text" placeholder="Aggiungi una spesa" className="input input-bordered w-full mb-4" onClick={openModal} />

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

                        <div>
                            <label className="label p-0">
                                <span className="label-text">Categoria</span>
                            </label>
                            <select name="categoriaId" value={form.categoriaId} onChange={handleChange} className="select select-bordered w-full">
                                {(!categories || categories.length === 0) && <option value="">Nessuna categoria</option>}
                                {(categories || []).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ flexDirection: 'row', display: 'flex', gap: '8px' }}>
                            <div style={{ flex: 1 }}>
                                    <input type="date" name="data" value={form.data} onChange={handleChange} className="input input-bordered w-full" />
                                    {errors.data && <p className="text-error text-sm">{errors.data}</p>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <input type="time" name="ora" value={form.ora} onChange={handleChange} className="input input-bordered w-full" />
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

export default function ElencoSpese({ id, className, listaSpese = [], listaCategorie = [], onAdd, onDelete }) {

     const [localList, setLocalList] = useState([])
     const [form, setForm] = useState({ titolo: '', descrizione: '', costo: '', data: '', ora: '', categoriaId: '' })
     const [pendingDeleteId, setPendingDeleteId] = useState(null)
     const [errors, setErrors] = useState({})
     const [showAddSection, setShowAddSection] = useState(true)
     const [showFilterSection, setShowFilterSection] = useState(true)
     const [filterQuery, setFilterQuery] = useState('')
     const [filterFrom, setFilterFrom] = useState('')
     const [filterTo, setFilterTo] = useState('')
     const [filterMin, setFilterMin] = useState('')
     const [filterMax, setFilterMax] = useState('')

     useEffect(() => {
         const sorted = [...(listaSpese || [])].sort((a, b) => (b?.data ? Date.parse(b.data) : 0) - (a?.data ? Date.parse(a.data) : 0))
         const enriched = (sorted || []).map(it => ({ ...it, categoriaNome: resolveCategoriaNome(it, listaCategorie) }))
         setLocalList(enriched)
     }, [listaSpese, listaCategorie])

     const closeModal = () => {
         setForm({ titolo: '', descrizione: '', costo: '', data: '', ora: '', categoriaId: '' })
         setErrors({})
         document.getElementById('modal_aggiunta')?.close()
     }

     // filtered list derived from localList and filters
     const filteredList = useMemo(() => {
        try {
            const q = String(filterQuery || '').trim().toLowerCase()
            const fromTs = filterFrom ? Date.parse(filterFrom) : null
            const toTs = filterTo ? Date.parse(filterTo) : null
            const minVal = filterMin !== '' ? Number(filterMin) : null
            const maxVal = filterMax !== '' ? Number(filterMax) : null

            return (localList || []).filter(item => {
                if (!item) return false
                if (q) {
                    const t = String(item.titolo || '').toLowerCase()
                    const d = String(item.descrizione || '').toLowerCase()
                    if (!t.includes(q) && !d.includes(q)) return false
                }
                if ((fromTs || toTs) && item.data) {
                    const it = Date.parse(item.data)
                    if (fromTs && isFinite(fromTs) && it < fromTs) return false
                    if (toTs && isFinite(toTs) && it > (toTs + 24 * 60 * 60 * 1000 - 1)) return false
                }
                const val = Number(item.importo ?? item.costo ?? 0)
                if (minVal !== null && !isNaN(minVal) && val < minVal) return false
                if (maxVal !== null && !isNaN(maxVal) && val > maxVal) return false
                return true
            })
        } catch (err) {
            return localList
        }
    }, [localList, filterQuery, filterFrom, filterTo, filterMin, filterMax])

     const openAddModal = () => {
         const now = new Date()
         setForm(f => ({ ...f, data: now.toISOString().slice(0,10), ora: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`, categoriaId: f.categoriaId || (listaCategorie?.[0]?.id || '') }))
         setTimeout(() => document.getElementById('modal_aggiunta')?.showModal(), 0)
     }

     const handleChange = (e) => {
         const { name, value } = e.target
         setForm(f => ({ ...f, [name]: value }))
     }

     const handleSubmit = (e) => {
         e.preventDefault()
         const titolo = form.titolo.trim()
         const importo = Number(form.costo)
         if (!titolo || titolo === '') return
         if (!form.costo || form.costo.toString().trim() === '') return
         if (isNaN(importo) || importo < 0) return

         let data
         if (form.data && form.ora) {
             try {
                     const [y, m, d] = form.data.trim().split('-').map(Number)
                     const [hh, mm] = form.ora.trim().split(':').map(Number)
                     const dt = new Date(y, m - 1, d, hh || 0, mm || 0)
                     data = dt.toISOString()
             } catch (err) {
                 data = new Date().toISOString()
             }
         } else {
             data = new Date().toISOString()
         }

         const selectedCat = (listaCategorie || []).find(c => String(c.id) === String(form.categoriaId)) || null

         const newItem = {
             titolo,
             descrizione: form.descrizione.trim() || '',
             importo,
             data,
             categoriaId: form.categoriaId || null,
             categoriaNome: selectedCat ? selectedCat.nome : '',
             categoria: selectedCat,
         }

         setLocalList(list => [newItem, ...(list || [])])

         if (typeof onAdd === 'function') {
             onAdd(newItem)
         }

         closeModal()
     }

    return (
        <section id="elenco_section" className={`panel panel-elenco ${className || ''}`} aria-labelledby="elenco_title">
            <h2 id="elenco_title">Elenco Spese</h2>

            {/* toggles for showing/hiding sections */}
            <div className='card bg-base-200 shadow-xl image-full scritta carta p-5 h-30'>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <button className={`btn btn-sm ${showAddSection ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShowAddSection(s => !s)}>
                        {showAddSection ? 'Nascondi Aggiunta' : 'Mostra Aggiunta'}
                    </button>
                    <button className={`btn btn-sm ${showFilterSection ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShowFilterSection(s => !s)}>
                        {showFilterSection ? 'Nascondi Filtri' : 'Mostra Filtri'}
                    </button>
                </div>
            </div>


            {showAddSection && (
                <div className="card bg-base-200 shadow-xl image-full scritta carta p-5 h-20">
                            <FormModal form={form} handleChange={handleChange} handleSubmit={handleSubmit} closeModal={closeModal} errors={errors} openModal={openAddModal} categories={listaCategorie} />
                </div>
            )}

            {showFilterSection && (
                <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" >
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <input className="input input-sm input-bordered" placeholder="Cerca titolo o descrizione" value={filterQuery} onChange={e => setFilterQuery(e.target.value)} />
                        <input className="input input-sm input-bordered" type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
                        <input className="input input-sm input-bordered" type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} />
                        <input className="input input-sm input-bordered" type="number" placeholder="Min importo" value={filterMin} onChange={e => setFilterMin(e.target.value)} step="0.01" />
                        <input className="input input-sm input-bordered" type="number" placeholder="Max importo" value={filterMax} onChange={e => setFilterMax(e.target.value)} step="0.01" />
                        <button className="btn btn-sm" onClick={() => { setFilterQuery(''); setFilterFrom(''); setFilterTo(''); setFilterMin(''); setFilterMax('') }}>Azzera</button>
                    </div>
                </div>
            )}

            <div className="panel-body" aria-live="polite" style={{ display: 'flex', flexDirection: 'column' }}>

                <div className="lista-wrapper" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
                    <AggiungiSpese list={filteredList} categories={listaCategorie} onRequestDelete={(id) => {
                        setPendingDeleteId(id)
                        // open the confirm dialog
                        setTimeout(() => document.getElementById('confirm_delete').showModal(), 0)
                    }} />
                </div>

                <DeleteModal pendingDeleteId={pendingDeleteId} setPendingDeleteId={setPendingDeleteId} setLocalList={setLocalList} onDelete={onDelete} />
            </div>
        </section>
    )
}
