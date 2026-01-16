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

    const formStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff'
    };

    const fieldsContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
    };

    const fieldStyle = {
        flex: '1 1 calc(50% - 10px)',
        minWidth: '200px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '20px'
    };

    return (
        <>
            <form onSubmit={onSubmit} style={formStyle}>
                <div style={fieldsContainerStyle}>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Nome:</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Cognome:</label>
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Email:</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Indirizzo:</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />
                    </div>
                </div>
                <button type="submit" style={buttonStyle} onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'} onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}>Aggiungi Persona</button>
            </form>
            
        </>
    )

}

export default FormAggiunta