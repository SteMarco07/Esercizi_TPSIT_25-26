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

    // Funzione per gestire l'aggiunta di un libro
    const handleAdd = async () => {
        try {
            setBusy(true)
            await addResource(generateLibro())
            setShowModal(false)
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
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Aggiungi un Libro</h3>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <input type="text" placeholder="Aggiungi un libro" className="input input-lg  w-full" onChange={(e) => setTitolo(e.target.value)} />
                            <input type="text" placeholder="Autore" className="input input-lg  w-full" onChange={(e) => setAutore(e.target.value)} />
                            <input type="text" placeholder="Editore" className="input input-lg  w-full" onChange={(e) => setEditore(e.target.value)} />
                            <input type="text" placeholder="Genere" className="input input-lg  w-full" onChange={(e) => setGenere(e.target.value)} />
                            <input type="number" placeholder="Anno" className="input input-lg  w-full" onChange={(e) => setAnno(e.target.value)} />
                            <input type="text" placeholder="ISBN" className="input input-lg  w-full" onChange={(e) => setIsbn(e.target.value)} />
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowModal(false)} disabled={busy}>Annulla</button>
                            <button className="btn btn-primary" onClick={handleAdd} disabled={busy}>
                                {busy ? 'Aggiunta...' : 'Aggiungi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}