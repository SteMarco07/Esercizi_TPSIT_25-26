# Spese Tracker

## Descrizione del Progetto

Spese Tracker è un'applicazione web sviluppata con React e Vite per la gestione e il monitoraggio delle spese personali. L'app permette agli utenti di registrare, categorizzare e analizzare le proprie spese attraverso un'interfaccia intuitiva, supportata da grafici interattivi e un sistema di autenticazione basato su PocketBase.
<img width="1599" height="765" alt="image" src="https://github.com/user-attachments/assets/fb27ffd3-e336-485d-8f49-afe9bd73a7ea" />


## Requisiti Funzionali

### Must Have
- **Autenticazione Utente**: Registrazione, login e logout degli utenti con gestione delle sessioni.
- **Gestione Categorie**: Creazione, modifica ed eliminazione di categorie per organizzare le spese.
- **Gestione Spese**: Aggiunta, modifica ed eliminazione di spese, associate a categorie, importi e date.

### Should Have
- **Visualizzazione Spese**: Elenco delle spese filtrate per categoria, data o altri criteri.
- **Dashboard**: Pagina principale con riepilogo delle spese e accesso rapido alle funzionalità.

### Could Have
- **Analisi e Grafici**: Visualizzazione di statistiche attraverso grafici interattivi (torta per distribuzione categorie, barre per spese annuali, linee per serie temporali, calendario per spese giornaliere).

### Won't Have
- Notifiche push per avvisi di superamento budget.
- Esportazione dei dati in formati come PDF o CSV.
- Supporto per multi-utenza condivisa (famiglie o gruppi).

I requisiti funzionali "Won't Have" sono stati categorizzati in questo modo fin dall'inizio per avere chiaro un obiettivo da raggiungere senza "distrazioni", trascurando funzionalità che potrebbero essere implementate in futuro, ma inizialmente è stato preferibile evitarle.



## Requisiti Non Funzionali

- **Prestazioni**: Build veloce grazie a Vite.
- **Sicurezza**: Autenticazione sicura e gestione dei dati tramite PocketBase.
- **Usabilità**: Interfaccia utente responsive e intuitiva, realizzata con TailwindCSS e DaisyUI.
- **Compatibilità**: Supporto per browser moderni.
- **Scalabilità**: Architettura modulare per gestire un numero crescente di spese e utenti.
