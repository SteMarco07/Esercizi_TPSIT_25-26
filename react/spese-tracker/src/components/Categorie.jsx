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

function Categorie() {
    // theme persistence: initialize using safe helper
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
        const newCat = await addCategoria({ nome, descrizione })
        setCategorie(prev => [...prev, newCat])
        setNome('')
        setDescrizione('')
        setIsModalOpen(false)
    }

    const handleDelete = async (id) => {
        await deleteCategoria(id)
        setCategorie(prev => prev.filter(c => c.id !== id))
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
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorie.map(cat => (
                                <tr key={cat.id}>
                                    <td>{cat.nome}</td>
                                    <td>{cat.descrizione || '-'}</td>
                                    <td>
                                        <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-error">Elimina</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                <dialog open={isModalOpen} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Aggiungi Categoria</h3>
                        <div className="py-4">
                            <input
                                type="text"
                                placeholder="Nome della categoria"
                                className="input input-bordered"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Breve descrizione (opzionale)"
                                className="textarea textarea-bordered"
                                value={descrizione}
                                onChange={(e) => setDescrizione(e.target.value)}
                                rows="3"
                            />
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setIsModalOpen(false)}>Annulla</button>
                            <button className="btn btn-primary" onClick={handleAdd}>Salva</button>
                        </div>
                    </div>
                </dialog>
            </main>
        </div>
    )
}

export default Categorie
