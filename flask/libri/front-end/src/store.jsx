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
    addResource: async (data) => {
        set({ isLoading: true, error: null });
        try {

            const risultato = await api.addResource(data);
            const current = get().resources;
            set({ resources: [...current, risultato.libro], isLoading: false });

        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    }
}));