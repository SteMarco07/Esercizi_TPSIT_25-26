import React, { useState } from 'react'
import FormAggiunta from './formAggiunta'

export default function TopBar() {
    const [searchText, setSearchText] = useState('')
    const [showSearchModal, setShowSearchModal] = useState(false)
    const [showCommandsSection, setShowCommandsSection] = useState(false)
    const [addCount, setAddCount] = useState('')

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
                <button className="btn btn-square" onClick={() => setShowSearchModal(true)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>


            <div className="navbar-center">
                <h1 className="text-3xl font-bold">Elenco Libri</h1>
            </div>

            <div className="navbar-end space-x-2">

                <FormAggiunta />

                <button className="btn btn-primary" onClick={() => setShowCommandsSection(!showCommandsSection)}>
                    Azioni
                </button>


            </div>

            {/* Modale Ricerca */}
            {showSearchModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Opzioni Ricerca</h3>
                        <p className="py-4">Seleziona i campi per la ricerca:</p>
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Titolo</span>
                                <input type="checkbox" className="checkbox" />
                            </label>
                            <label className="label cursor-pointer">
                                <span className="label-text">Autore</span>
                                <input type="checkbox" className="checkbox" />
                            </label>
                            <label className="label cursor-pointer">
                                <span className="label-text">Editore</span>
                                <input type="checkbox" className="checkbox" />
                            </label>
                            <label className="label cursor-pointer">
                                <span className="label-text">Genere</span>
                                <input type="checkbox" className="checkbox" />
                            </label>
                            <label className="label cursor-pointer">
                                <span className="label-text">Anno</span>
                                <input type="checkbox" className="checkbox" />
                            </label>
                            <label className="label cursor-pointer">
                                <span className="label-text">ISBN</span>
                                <input type="checkbox" className="checkbox" />
                            </label>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowSearchModal(false)}>Chiudi</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sezione Comandi */}
            {showCommandsSection && (
                <div className="absolute top-20 right-4 bg-base-100 shadow-lg rounded-box p-4 z-10">
                    <h4 className="font-bold mb-2">Comandi Backend</h4>

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
                        <button className="btn btn-success btn-sm flex-1">Aggiungi {addCount || 0} libri</button>
                        <button className="btn btn-error btn-sm flex-1">Elimina tutti i libri</button>
                    </div>

                </div>
            )}
        </div>
    )
}