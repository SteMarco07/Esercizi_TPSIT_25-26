import React, { useState, useEffect, useMemo } from 'react'
import Elemento from './Elemento'
import AddSpesaModal from './AddSpesaModal'
import AddCategoriaModal from './AddCategoriaModal'
import { getSpese, getCategorie, deleteSpesa } from '../services/pocketbaseService'
import { resolveCategoriaNome, resolveCategoriaColore } from '../utils/categoriaUtils'

function AggiungiSpese({ list = [], categories = [], onRequestDelete }) {
    return list.map((element, pos) => {
        const nomeCat = resolveCategoriaNome(element, categories)
        const coloreCat = resolveCategoriaColore(element, categories)
        return (
            <Elemento
                key={element.id ?? pos}
                id={element.id}
                titolo={element.titolo}
                descrizione={element.descrizione}
                data={element.data}
                costo={element.importo ?? element.costo}
                categoriaNome={nomeCat}
                categoriaColore={coloreCat}
                onRequestDelete={onRequestDelete}
                asRow={true}
            />
        )
    })
}
// FormModal removed: replaced by AddSpesaModal/AddCategoriaModal

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

export default function ElencoSpese() {

    // theme persistence helpers (match Categorie page)
    function safeGetItem(key, fallback = null) {
        try {
            if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return fallback
            const v = window.localStorage.getItem(key)
            return v === null ? fallback : v
        } catch (e) {
            return fallback
        }
    }

    function safeSetItem(key, value) {
        try {
            if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return
            window.localStorage.setItem(key, value)
        } catch (e) {
            // ignore
        }
    }

    const [theme, setTheme] = useState(() => safeGetItem('theme', 'dark'))
    useEffect(() => {
        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.setAttribute('data-theme', theme)
        }
        safeSetItem('theme', theme)
    }, [theme])

    const [localList, setLocalList] = useState([])
    const [categorie, setCategorie] = useState([])
    const [pendingDeleteId, setPendingDeleteId] = useState(null)
    const [showFilterSection, setShowFilterSection] = useState(false)
    const [filterQuery, setFilterQuery] = useState('')
    const [filterFrom, setFilterFrom] = useState('')
    const [filterTo, setFilterTo] = useState('')
    const [filterCategoria, setFilterCategoria] = useState('')
    const [filterMin, setFilterMin] = useState('')
    const [filterMax, setFilterMax] = useState('')

    useEffect(() => {
        async function fetchAll() {
            try {
                const [s, c] = await Promise.all([getSpese(), getCategorie()])
                const sorted = [...(s || [])].sort((a, b) => (b?.data ? Date.parse(b.data) : 0) - (a?.data ? Date.parse(a.data) : 0))
                const enriched = (sorted || []).map(it => ({ ...it, categoriaNome: resolveCategoriaNome(it, c) }))
                setLocalList(enriched)
                setCategorie(c || [])
            } catch (err) {
                console.error('Errore nel caricamento delle spese/categorie:', err)
            }
        }
        fetchAll()
    }, [])

    // modal handling moved to AddSpesaModal/AddCategoriaModal

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

                if (filterCategoria) {
                    const fc = String(filterCategoria)
                    // try to resolve item category id (several possible shapes)
                    let itemCatId = null
                    if (item.categoriaId) itemCatId = item.categoriaId
                    else if (item.categoryId) itemCatId = item.categoryId
                    else if (item._categoria) itemCatId = item._categoria
                    else if (item.categoria) {
                        if (typeof item.categoria === 'string') itemCatId = item.categoria
                        else if (typeof item.categoria === 'object' && (item.categoria.id || item.categoria._id)) itemCatId = item.categoria.id || item.categoria._id
                    }

                    if (itemCatId !== null && itemCatId !== undefined) {
                        if (String(itemCatId) !== fc) return false
                    } else {
                        // fallback: compare resolved category name to selected category name
                        const selected = (categorie || []).find(c => String(c.id) === fc)
                        if (selected) {
                            const itemName = String(resolveCategoriaNome(item, categorie) || '').toLowerCase()
                            if (itemName !== String(selected.nome || '').toLowerCase()) return false
                        }
                    }
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
    }, [localList, filterQuery, filterFrom, filterTo, filterMin, filterMax, filterCategoria, categorie])

    // quick add logic moved into AddSpesaModal; we update localList in its onCreated callback

    const handleDelete = async (id) => {
        try {
            await deleteSpesa(id)
        } catch (err) {
            console.error('Eliminazione fallita:', err)
            throw err
        }
    }

    return (
        <div className='div_pagina'>
            <main id="main_section" className="ml-64 p-4 flex flex-col">

                <div className="flex items-center mb-4 gap-4 w-full">
                    <h1 className="text-2xl font-bold w-full">Elenco Spese</h1>
                    <div className="flex gap-2">
                        <AddSpesaModal categorie={categorie} onCreated={(created) => {
                            const enriched = { ...created, categoriaNome: resolveCategoriaNome(created, categorie) }
                            setLocalList(list => [enriched, ...(list || [])])
                        }} />
                    </div>
                    <button className={`btn btn-sm ${showFilterSection ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShowFilterSection(s => !s)}>
                        {showFilterSection ? 'Nascondi Filtri' : 'Mostra Filtri'}
                    </button>
                </div>

                {showFilterSection && (
                    <div className="card shadow-xl image-full carta p-5  w-full">
                        <div className="flex items-center gap-2 flex-nowrap">
                            <input className="input input-sm input-bordered flex-[2] min-w-[140px]" placeholder="Cerca titolo o descrizione" value={filterQuery} onChange={e => setFilterQuery(e.target.value)} />

                            <select className="select select-sm select-bordered flex-1 min-w-[120px]" value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)}>
                                <option value="">Tutte le categorie</option>
                                {(categorie || []).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                ))}
                            </select>

                            <input className="input input-sm input-bordered flex-1 min-w-[120px]" type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
                            <input className="input input-sm input-bordered flex-1 min-w-[120px]" type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} />

                            <input className="input input-sm input-bordered flex-1 min-w-[100px]" type="number" placeholder="Min importo" value={filterMin} onChange={e => setFilterMin(e.target.value)} step="0.01" />
                            <input className="input input-sm input-bordered flex-1 min-w-[100px]" type="number" placeholder="Max importo" value={filterMax} onChange={e => setFilterMax(e.target.value)} step="0.01" />

                            <div className="ml-auto">
                                <button className="btn btn-sm" onClick={() => { setFilterQuery(''); setFilterFrom(''); setFilterTo(''); setFilterMin(''); setFilterMax(''); setFilterCategoria('') }}>Azzera</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto w-full overflow-y-auto mt-5" style={{ maxHeight: '67vh' }}>
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Titolo</th>
                                <th>Descrizione</th>
                                <th>Data</th>
                                <th>Importo</th>
                                <th>Categoria</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AggiungiSpese list={filteredList} categories={categorie} onRequestDelete={(id) => {
                                setPendingDeleteId(id)
                                setTimeout(() => document.getElementById('confirm_delete')?.showModal(), 0)
                            }} />
                        </tbody>
                    </table>
                </div>

                {/* Modals */}
                <DeleteModal pendingDeleteId={pendingDeleteId} setPendingDeleteId={setPendingDeleteId} setLocalList={setLocalList} onDelete={handleDelete} />


            </main>

        </div>
    )
}
