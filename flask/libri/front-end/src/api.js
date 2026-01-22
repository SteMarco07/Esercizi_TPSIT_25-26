
export const api = {
    // [READ] Leggi tutte le risorse
    fetchResources: async () => {
        const response = await fetch('http://127.0.0.1:11000/api/libri')
        const json = await response.json()
        return json
    }
    ,
    // [DELETE] Elimina una risorsa per id
    deleteResource: async (id) => {
        const url = `http://127.0.0.1:11000/api/libri/${id}`
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!response.ok) {
            const text = await response.text().catch(() => '')
            throw new Error(text || `Delete failed (${response.status})`)
        }
        // optional: try parse json body when provided
        try {
            return await response.json()
        } catch (e) {
            return null
        }
    },
    // [POST] Crea una risorsa
    addResource: async (data) => {
        const url = `http://127.0.0.1:11000/api/libri`
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            const text = await response.text().catch(() => '')
            throw new Error(text || `Add failed (${response.status})`)
        }
        // optional: try parse json body when provided
        try {
            return await response.json()
        } catch (e) {
            return null
        }
    },
    // [GET] Genera nuove risorse fittizie
    generateResource: async (times) => {
        const response = await fetch("http://127.0.0.1:11000/api/libri/generate/" + times )
        if (!response.ok) {
            const text = await response.text().catch(() => '')
            throw new Error(text || `Add failed (${response.status})`)
        }
        // optional: try parse json body when provided
        try {
            return await response.json()
        } catch (e) {
            return null
        }
    },
    // [DELETE] Elimina tutte le risorse
    deleteAllResources: async () => {
        const url = `http://127.0.0.1:11000/api/libri`
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!response.ok) {
            const text = await response.text().catch(() => '')
            throw new Error(text || `Delete failed (${response.status})`)
        }
        // optional: try parse json body when provided
        try {
            return await response.json()
        } catch (e) {
            return null
        }
    },

};