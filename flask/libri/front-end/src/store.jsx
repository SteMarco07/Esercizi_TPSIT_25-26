import { create } from 'zustand';
import { api } from './api';

/**
 * ZUSTAND STORE
 *
 * Qui definiamo lo stato globale dell'applicazione.
 * create() accetta una funzione (set, get) che restituisce l'oggetto di stato.
 */
export const useStore = create((set, get) => ({
    // STATO INIZIALE
    resources: [],  // Lista delle risorse (vuota all'inizio)
    isLoading: false, // Flag per mostrare il caricamento
    error: null,      // Per gestire eventuali errori
    searchText: '',   // Testo di ricerca
    searchFields: {   // Campi attivi per ricerca
        titolo: true,
        autore: true,
        anno: true,
        editore: false,
        genere: false,
        isbn: false
    },

    // AZIONI (Functioni per modificare lo stato)

    // 1. Fetch dei dati (Asincrona)
    fetchResources: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.fetchResources();
            set({ resources: data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
    // 2. Eliminazione di una risorsa per id (Asincrona)
    deleteResource: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const risultato = await api.deleteResource(id);
            console.log(risultato);
            const remaining = get().resources.filter(r => r.id !== id);
            set({ resources: remaining, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err
        }
    },
    // 3. Aggiunta di una risorsa (Asincrona)
    addResource: async (times) => {
        set({ isLoading: true, error: null });
        try {
            const risultato = await api.addResource(times);
            const current = get().resources;
            current.push(risultato.libro);
            set({ resources: current, isLoading: false });

        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
    // 4. Genera nuove risorse fittizie (Asincrona)
    generateResource: async (times) => {
        set({ isLoading: true, error: null });
        try {
            const risultato = await api.generateResource(times);
            const current = get().resources;
            for (const libro of risultato.nuovi_libri) {
                current.push(libro);
            }
            set({ resources: current, isLoading: false });

        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
    // 5. Genera un suggerimento di un libro per il form di aggiunta
    generateBookSuggestion: async () => {
        set({ isLoading: true, error: null });
        try {
            const risultato = await api.generateResource(1);
            console.log(risultato);
            set({isLoading: false });
            return risultato;
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
    // 6. Imposta testo ricerca
    setSearchText: (text) => set({ searchText: text }),
    // 7. Toggle campo ricerca
    toggleSearchField: (field) => set((state) => ({
        searchFields: { ...state.searchFields, [field]: !state.searchFields[field] }
    })),
    // 8. Getter risorse filtrate
    getFilteredResources: () => {
        const { resources, searchText, searchFields } = get();
        if (!searchText.trim()) return resources;
        return resources.filter(book =>
            Object.entries(searchFields).some(([field, active]) =>
                active && book[field]?.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );
    },
    // 9. Elimina tutte le risorse
    deleteAllResources: async () => {
        set({ isLoading: true, error: null });
        try {
            const risultato = await api.deleteAllResources();
            console.log(risultato);
            const remaining = risultato.libri;
            set({ resources: remaining, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err
        }
    },
    // 10. Modifca di una risorsa esistente
    updateResource: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const risultato = await api.updateResource(data);
            console.log(risultato);
            const libro_modificato = risultato.libro;
            const current = get().resources;
            for (const libro in current) {
                if (libro.id == libro_modificato.id) {
                    libro = libro_modificato
                    break
                }
            }
            set({ resources: current, isLoading: false });

        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    }
}));