import { use, useEffect, useState } from 'react'

function FormAggiunta({handleSubmit}) {
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')


    const onSubmit = (e) => {
        e.preventDefault()
        const data = {
            name: name,
            last_name: lastName,
            email: email,
            address: address
        }
        handleSubmit(e, data)
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Nome:</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <label>Cognome:</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Indirizzo:</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <button type="submit">Aggiungi Persona</button>
            </form>
            
        </>
    )

}

export default FormAggiunta