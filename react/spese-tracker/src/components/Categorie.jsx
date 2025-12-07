import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { getCategorie, addCategoria, deleteCategoria } from '../services/pocketbaseService'

// safe localStorage helpers (avoid ReferenceError in non-browser contexts)
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

function Categoria({ list, onRequestDelete }) {
    return (
        list.map(cat => (
            <tr key={cat.id}>
                <td>{cat.nome}</td>
                <td>{cat.descrizione || '-'}</td>
                <td>
                    {cat.colore ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: cat.colore, border: '1px solid rgba(0,0,0,0.1)' }} aria-hidden></div>
                            <span className="text-sm">{cat.colore}</span>
                        </div>
                    ) : '-'}
                </td>
                <td>
                    <button onClick={() => onRequestDelete(cat.id)} className="btn btn-sm btn-error">X</button>
                </td>
            </tr>
        ))
    )
}

function AddModal({ isModalOpen, setIsModalOpen, nome, setNome, descrizione, setDescrizione, colore, setColore, handleAdd }) {
    return (
        <dialog open={isModalOpen} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Aggiungi Categoria</h3>
                <div className="py-4">
                    <div className="py-4 space-y-4">
                        <div className="flex gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Nome della categoria"
                                className="input input-bordered flex-1"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />

                            <div className="flex items-center gap-2">
                                <label className="text-sm">Colore</label>
                                <input type="color" value={colore} onChange={(e) => setColore(e.target.value)} className="w-10 h-10 p-0 border rounded" />
                            </div>
                        </div>

                        <div>
                            <textarea
                                placeholder="Breve descrizione (opzionale)"
                                className="textarea textarea-bordered w-full"
                                value={descrizione}
                                onChange={(e) => setDescrizione(e.target.value)}
                                rows="3"
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <button className="btn" onClick={() => { setIsModalOpen(false); setColore('#ffffff'); }}>Annulla</button>
                    <button className="btn btn-primary" onClick={handleAdd}>Salva</button>
                </div>
            </div>
        </dialog>
    )
}

function DeleteModal({ pendingDeleteId, setPendingDeleteId, handleDelete }) {
    return (
        <dialog id="confirm_delete_category" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Conferma eliminazione</h3>
                <p className="py-4">Sei sicuro di voler eliminare questa categoria? Questa operazione non è reversibile.</p>
                <div className="modal-action">
                    <button className="btn" onClick={() => { setPendingDeleteId(null); document.getElementById('confirm_delete_category')?.close(); }}>Annulla</button>
                    <button className="btn btn-error" onClick={async () => {
                        const idToDelete = pendingDeleteId
                        try {
                            await handleDelete(idToDelete)
                        } catch (err) {
                            console.error('Eliminazione fallita:', err)
                        } finally {
                            setPendingDeleteId(null)
                            document.getElementById('confirm_delete_category')?.close()
                        }
                    }}>Elimina</button>
                </div>
            </div>
        </dialog>)
}


function Categorie() {
    const [theme, setTheme] = useState(() => safeGetItem('theme', 'dark'))

    useEffect(() => {
        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.setAttribute('data-theme', theme)
        }
        safeSetItem('theme', theme)
    }, [theme])

    const [categorie, setCategorie] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [nome, setNome] = useState('')
    const [descrizione, setDescrizione] = useState('')
    const [colore, setColore] = useState('#ffffff')
    const [pendingDeleteId, setPendingDeleteId] = useState(null)

    useEffect(() => {
        const fetchCategorie = async () => {
            const data = await getCategorie()
            setCategorie(data)
        }
        fetchCategorie()
    }, [])

    const handleAdd = async () => {
        if (!nome.trim()) {
            alert('Il nome è obbligatorio')
            return
        }
        const newCat = await addCategoria({ nome, descrizione, colore })
        setCategorie(prev => [...prev, newCat])
        setNome('')
        setDescrizione('')
        setColore('#ffffff')
        setIsModalOpen(false)
    }

    const requestDelete = (id) => {
        setPendingDeleteId(id)
        setTimeout(() => document.getElementById('confirm_delete_category')?.showModal(), 0)
    }

    return (
        <div id="div_pagina">
            <NavBar theme={theme} setTheme={setTheme} />
            <main id="main_section" className="ml-64 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4 w-full">
                    <h1 className="text-2xl font-bold">Categorie</h1>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+</button>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Descrizione</th>
                                <th>Colore</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Categoria list={categorie} onRequestDelete={requestDelete} />
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                <AddModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    nome={nome}
                    setNome={setNome}
                    descrizione={descrizione}
                    setDescrizione={setDescrizione}
                    colore={colore}
                    setColore={setColore}
                    handleAdd={handleAdd}
                />
                <DeleteModal
                    pendingDeleteId={pendingDeleteId}
                    setPendingDeleteId={setPendingDeleteId}
                    handleDelete={async (id) => {
                        await deleteCategoria(id)
                        setCategorie(prev => prev.filter(cat => cat.id !== id))
                    }}
                />

            </main>
        </div>
    )
}

export default Categorie
