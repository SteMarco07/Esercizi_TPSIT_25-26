import React, { useState } from 'react'
import FormAggiunta from './formAggiunta'
import { useStore } from '../store.jsx'

export default function TopBar() {
    const { searchText, searchFields, setSearchText, toggleSearchField, generateResource, deleteAllResources } = useStore()
    const [addCount, setAddCount] = useState('')
    const [showSearchSection, setShowSearchSection] = useState(false)
    const [showCommandsSection, setShowCommandsSection] = useState(false)

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

                <FormAggiunta />

                <button className="btn btn-primary" onClick={() => setShowCommandsSection(!showCommandsSection)}>
                    Azioni
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
                        <button className="btn btn-success btn-sm flex-1" onClick={() => generateResource(addCount)}>Aggiungi {addCount || 0} libri</button>
                        <button className="btn btn-error btn-sm flex-1" onClick={() => deleteAllResources()}>Elimina tutti i libri</button>
                    </div>

                </div>
            )}
        </div>
    )
}