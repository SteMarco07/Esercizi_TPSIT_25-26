import React, { useState, useEffect } from 'react'
import { useStore } from '../store.jsx'

export default function FormAggiunta({ book }) {

    const addResource = useStore(state => state.addResource)
    const generateBookSuggestion = useStore(state => state.generateBookSuggestion)
    const [showModal, setShowModal] = useState(false)
    const [busy, setBusy] = useState(false)
    const [titolo, setTitolo] = useState("")
    const [autore, setAutore] = useState("")
    const [editore, setEditore] = useState("")
    const [genere, setGenere] = useState("")
    const [anno, setAnno] = useState("")
    const [isbn, setIsbn] = useState("")

    // Funzione per crare il dizionario di un libro
    const generateLibro = () => {
        return {
            "titolo": titolo,
            "autore": autore,
            "editore": editore,
            "genere": genere,
            "anno": anno,
            "isbn": isbn
        }
    }

    const clearForm = () => {
        setTitolo("")
        setAutore("")
        setEditore("")
        setGenere("")
        setAnno("")
        setIsbn("")
    }


    const isFormValid = () => {
        return titolo.trim() && autore.trim() && editore.trim() && genere.trim() && anno.trim() && isbn.trim()
    }

    // Funzione per gestire l'aggiunta di un libro
    const handleAdd = async () => {
        if (!isFormValid) {
            alert('Tutti i campi devono essere riempiti.')
            return
        }
        try {
            setBusy(true)
            await addResource(generateLibro())
            setShowModal(false)
            clearForm()
        } catch (e) {
            // basic user feedback
            alert('Errore aggiunta: ' + (e.message || e))
        } finally {
            setBusy(false)
        }
    }

    const handleSuggestion = async () => {
        try {
            setBusy(true)
            const suggestion = await generateBookSuggestion()
            const libro = suggestion.nuovi_libri[0]

            setTitolo(libro.titolo)
            setAutore(libro.autore)
            setEditore(libro.editore)
            setGenere(libro.genere)
            setAnno(libro.anno)
            setIsbn(libro.isbn)
        } catch (e) {
            // basic user feedback
            alert('Errore suggerimento: ' + (e.message || e))
        } finally {
            setBusy(false)
        }
    }

    return (
        <>
            <button className="btn btn-primary" onClick={() => setShowModal(true)} aria-label="Aggiungi libro">
                Aggiungi Libro
            </button>

            {showModal && (
                <div className={`modal modal-open`} onClick={() => setShowModal(false)}>
                    <div className="modal-box w-11/12 max-w-xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold text-2xl text-center mb-6">Aggiungi un Nuovo Libro</h3>

                        <div className="grid grid-cols-1 gap-3">
                            {/* Campo del titolo */}
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Titolo</span></label>
                                <input type="text" placeholder="Titolo del libro" className="input input-bordered w-full" value={titolo} onChange={(e) => setTitolo(e.target.value)} required />
                            </div>
                            {/* Campo dell'autore */}
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Autore</span></label>
                                <input type="text" placeholder="Nome Autore" className="input input-bordered w-full" value={autore} onChange={(e) => setAutore(e.target.value)} required />
                            </div>
                            <div className="flex gap-5">
                                {/* Campo dell'editore */}
                                <div className="form-control flex-1">
                                    <label className="label"><span className="label-text font-semibold">Editore</span></label>
                                    <input type="text" placeholder="Casa Editrice" className="input input-bordered w-full" value={editore} onChange={(e) => setEditore(e.target.value)} required />
                                </div>
                                {/* Campo del genere */}
                                <div className="form-control flex-1">
                                    <label className="label"><span className="label-text font-semibold">Genere</span></label>
                                    <input type="text" placeholder="Genere" className="input input-bordered w-full" value={genere} onChange={(e) => setGenere(e.target.value)} required />
                                </div>

                            </div>
                            <div className="flex gap-5">
                                {/* Campo della descrizione */}
                                <div className="form-control flex-1">
                                    <label className="label"><span className="label-text font-semibold">Anno</span></label>
                                    <input type="number" placeholder="Anno di pubblicazione" className="input input-bordered w-full" value={anno} onChange={(e) => setAnno(e.target.value)} required />
                                </div>
                                {/* Campo dell'ISBN */}
                                <div className="form-control flex-1">
                                    <label className="label"><span className="label-text font-semibold">ISBN</span></label>
                                    <input type="text" placeholder="Codice ISBN" className="input input-bordered w-full" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
                                </div>
                            </div>

                        </div>

                        <div className="modal-action mt-8">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)} disabled={busy}>Annulla</button>
                            <button className="btn btn-accent" onClick={clearForm} disabled={busy}>Pulisci campi</button>
                            <button className="btn btn-secondary" onClick={handleSuggestion} disabled={busy}>
                                {busy ? 'Suggerimento...' : 'Suggerisci'}
                            </button>
                            <button className="btn btn-primary" onClick={handleAdd} disabled={!isFormValid() || busy}>
                                {busy ? 'Salvataggio...' : 'Aggiungi Libro'}
                            </button>
                        </div>
                        {!isFormValid() && (
                            <p className="text-sm text-error mt-2 text-center">Tutti i campi devono essere riempiti per procedere.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}