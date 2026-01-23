const BASE = 'http://127.0.0.1:11000'

async function request(path, options = {}) {
    const res = await fetch(BASE + path, options)
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `${res.status} ${res.statusText}`)
    }
    try {
        return await res.json()
    } catch (e) {
        return null
    }
}

export const api = {
    // [READ] Leggi tutte le risorse
    fetchResources: async () => request('/api/libri'),

    // [DELETE] Elimina una risorsa per id
    deleteResource: async (id) => request(`/api/libri/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    }),

    // [POST] Crea una risorsa
    addResource: async (data) => request('/api/libri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    // [GET] Genera nuove risorse fittizie
    generateResource: async (times) => request(`/api/libri/generate/${times || 100}`),

    // [DELETE] Elimina tutte le risorse
    deleteAllResources: async () => request('/api/libri', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    }),

    // [PATCH] Aggiorna una risorsa per id
    updateResource: async (data) => request('/api/libri/modify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
}