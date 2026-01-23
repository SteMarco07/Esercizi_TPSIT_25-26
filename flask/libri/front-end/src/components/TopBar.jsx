import React, { useState, useEffect } from 'react'
import FormAggiunta from './formAggiunta'
import { useStore } from '../store.jsx'

export default function TopBar() {
    const { searchText, searchFields, setSearchText, toggleSearchField, generateResource, deleteAllResources } = useStore()
    const [addCount, setAddCount] = useState('')
    const [showSearchSection, setShowSearchSection] = useState(false)
    const [showCommandsSection, setShowCommandsSection] = useState(false)
    const [showModalDeleteAll, setShowModalDeleteAll] = useState(false)
    const [busy, setBusy] = useState(false)
    // Theme (DaisyUI) state
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

    useEffect(() => {
        try {
            document.documentElement.setAttribute('data-theme', theme)
            localStorage.setItem('theme', theme)
        } catch (e) {
            // ignore in non-browser env
        }
    }, [theme])


    const handleDelete = async () => {
        try {
            setBusy(true)
            await deleteAllResources()
            setShowModalDeleteAll(false)
        } catch (e) {
            // basic user feedback
            console.log('Errore eliminazione: ' + (e.message || e))
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="navbar bg-base-100 shadow-lg mb-6 fixed top-0 left-0 right-0 z-50">
            <div className='navbar-start gap-3'>
                <input
                    type="text"
                    placeholder="Cerca libri..."
                    className="input input-bordered"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button className="btn btn-square" onClick={() => setShowSearchSection(!showSearchSection)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>


            <div className="navbar-center">
                <h1 className="text-3xl font-bold">Elenco Libri</h1>
            </div>

            <div className="navbar-end space-x-2">

                

                {/* Theme toggle button */}
                <button
                    className="btn btn-ghost"
                    onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                    title="Cambia tema"
                >
                    {theme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM15.22 4.78a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75H16a.75.75 0 010-1.5h1.25A.75.75 0 0118 10zM15.22 15.22a.75.75 0 00-1.06 1.06l1.06 1.06a.75.75 0 001.06-1.06l-1.06-1.06zM10 16a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0v-1.25A.75.75 0 0110 16zM4.78 15.22a.75.75 0 00-1.06-1.06L2.66 15.22a.75.75 0 001.06 1.06l1.06-1.06zM2 10a.75.75 0 01.75-.75H4a.75.75 0 010 1.5H2.75A.75.75 0 012 10zM4.78 4.78a.75.75 0 011.06-1.06L5.78 2.66A.75.75 0 004.72 3.72L3.66 4.78z" />
                            <path d="M10 5.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 1010.586 10.586z" />
                        </svg>
                    )}
                </button>
                <FormAggiunta />

                <button className="btn btn-primary" onClick={() => setShowCommandsSection(!showCommandsSection)}>
                    Gestione
                </button>

            </div>

            {/* Sezione Ricerca */}
            {showSearchSection && (
                <div className="absolute top-20 left-4 bg-base-100 shadow-lg rounded-box p-4 z-10">
                    <h4 className="font-bold mb-2">Opzioni Ricerca</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(searchFields).map(([field, active]) => (
                            <button
                                key={field}
                                className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => toggleSearchField(field)}
                            >
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sezione Comandi */}
            {showCommandsSection && (
                <div className="absolute top-20 right-4 bg-base-100 shadow-lg rounded-box p-4 z-10">
                    <h4 className="font-bold mb-2">Comandi di gestione dei libri</h4>

                    <div className='grid grid-cols-2 gap-2'>
                        <label className="label">
                            <span className="label-text">Aggiungi libri:</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Quantità"
                            className="input input-bordered input-sm"
                            value={addCount}
                            onChange={(e) => setAddCount(e.target.value)}
                        />
                        <button className="btn btn-success btn-sm flex-1" onClick={() => generateResource(addCount)}>Aggiungi {addCount || 0} libri</button>
                        <button className="btn btn-error btn-sm flex-1" onClick={() => setShowModalDeleteAll(true)}>Elimina tutti i libri</button>
                    </div>

                </div>
            )}

            {showModalDeleteAll && (
                <div className={`modal modal-open`}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Conferma eliminazione</h3>
                        <p className="py-4">Sei sicuro di voler eliminare tutti i libri?</p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => {setShowModalDeleteAll(false); }} disabled={busy}>Annulla</button>
                            <button className="btn btn-error" onClick={handleDelete}>
                                {busy ? 'Eliminazione...' : 'Elimina tutti i libri'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}