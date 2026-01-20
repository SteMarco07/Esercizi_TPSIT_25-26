import React, { useState } from 'react'
import { useStore } from '../store.jsx'

export default function FormAggiunta({ book }) {

    const addResource = useStore(state => state.addResource)
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

    // Funzione per gestire l'aggiunta di un libro
    const handleAdd = async () => {
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

    return (
        <>
            <label className="floating">
                <input type="text" placeholder="Aggiungi un libro" className="input input-lg  w-full" onClick={() => setShowModal(true)} />
            </label>

            {showModal && (
                <div className={`modal modal-open`}>
                    <div className="modal-box w-11/12 max-w-3xl">
                        <h3 className="font-bold text-2xl text-center mb-6">Aggiungi un Nuovo Libro</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Titolo</span></label>
                                <input type="text" placeholder="Titolo del libro" className="input input-bordered w-full" value={titolo} onChange={(e) => setTitolo(e.target.value)} />
                            </div>
                            
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Autore</span></label>
                                <input type="text" placeholder="Nome Autore" className="input input-bordered w-full" value={autore} onChange={(e) => setAutore(e.target.value)} />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Editore</span></label>
                                <input type="text" placeholder="Casa Editrice" className="input input-bordered w-full" value={editore} onChange={(e) => setEditore(e.target.value)} />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Genere</span></label>
                                <input type="text" placeholder="Genere" className="input input-bordered w-full" value={genere} onChange={(e) => setGenere(e.target.value)} />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Anno</span></label>
                                <input type="number" placeholder="Anno di pubblicazione" className="input input-bordered w-full" value={anno} onChange={(e) => setAnno(e.target.value)} />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">ISBN</span></label>
                                <input type="text" placeholder="Codice ISBN" className="input input-bordered w-full" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
                            </div>
                        </div>

                        <div className="modal-action mt-8">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)} disabled={busy}>Annulla</button>
                            <button className="btn btn-primary" onClick={handleAdd} disabled={busy}>
                                {busy ? 'Salvataggio...' : 'Aggiungi Libro'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}