# Documentazione del Progetto: Spese Tracker

## Introduzione

Spese Tracker è un'applicazione web per la gestione e il monitoraggio delle spese personali. Sviluppata con React e Vite, utilizza PocketBase come backend per l'autenticazione e la persistenza dei dati. L'app permette agli utenti di registrare spese, organizzarle in categorie e visualizzarle attraverso grafici interattivi.

## Architettura

L'applicazione segue un'architettura client-server:

- **Frontend**: React con routing tramite React Router. Utilizza TailwindCSS e DaisyUI per lo styling.
- **Backend**: PocketBase, un backend-as-a-service che gestisce autenticazione, database e file storage.
- **Database**: SQLite (gestito da PocketBase), con collezioni per utenti, spese e categorie.

### Struttura del Progetto

```
src/
├── components/          # Componenti React
│   ├── Graphics/        # Componenti per i grafici
│   ├── AddCategoriaModal.jsx
│   ├── AddSpesaModal.jsx
│   ├── Categorie.jsx
│   ├── ElencoGrafici.jsx
│   ├── ElencoSpese.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── RequireAuth.jsx
│   ├── Sidebar.jsx
│   ├── Signup.jsx
│   └── Spese.jsx
├── contexts/            # Context per la gestione dello stato globale
│   └── AuthContext.jsx
├── services/            # Servizi per l'interazione con PocketBase
│   └── pocketbaseService.js
├── utils/               # Utilità per categorie e grafici
│   ├── categoriaUtils.js
│   └── graphicsUtils.js
└── App.jsx              # Componente principale
```

## Installazione e Avvio

### Prerequisiti

- Node.js (versione 16 o superiore)
- PocketBase (scaricato e avviato su localhost:8090)

### Passi per l'Installazione

1. Clona il repository o scarica i file del progetto.
2. Installa le dipendenze:
   ```
   npm install
   ```
3. Avvia PocketBase nel backend (assicurati che sia in esecuzione su http://127.0.0.1:8090).
4. Avvia l'applicazione frontend:
   ```
   npm run dev
   ```
5. Apri il browser su http://localhost:5173 (porta predefinita di Vite).

### Configurazione

- Assicurati che l'URL di PocketBase in `App.jsx` corrisponda al tuo setup (predefinito: http://127.0.0.1:8090).
- Importa lo schema del database da `Example file/pb_schema.json` in PocketBase per creare le collezioni necessarie.

## Struttura del Database

Il database è gestito da PocketBase e include le seguenti collezioni:

### Utenti (users)
- Gestione dell'autenticazione standard di PocketBase.
- Campi: id, email, password, name, created, updated, ecc.

### Spese (spese)
- Memorizza le spese degli utenti.
- Campi:
  - `id`: Identificatore univoco (stringa).
  - `titolo`: Titolo della spesa (stringa, obbligatorio).
  - `descrizione`: Descrizione opzionale (stringa).
  - `importo`: Valore numerico della spesa (numero, obbligatorio, >=0).
  - `data`: Data della spesa (data, obbligatorio).
  - `categoria`: Relazione alla collezione categorie (obbligatorio).
  - `user`: Relazione all'utente proprietario (obbligatorio).
  - `created`: Data di creazione (autogenerata).
  - `updated`: Data di aggiornamento (autogenerata).

### Categorie (spese_categorie)
- Definisce le categorie per organizzare le spese.
- Campi:
  - `id`: Identificatore univoco (stringa).
  - `nome`: Nome della categoria (stringa).
  - `descrizione`: Descrizione opzionale (stringa).
  - `colore`: Codice colore per la categoria (stringa).
  - `user`: Relazione all'utente proprietario (obbligatorio).
  - `created`: Data di creazione (autogenerata).
  - `updated`: Data di aggiornamento (autogenerata).

Tutte le collezioni hanno regole di sicurezza che limitano l'accesso ai dati dell'utente autenticato.

## Componenti Principali

### Autenticazione
- `Login.jsx`: Form per il login degli utenti esistenti. Include campi per email e password, validazione degli input, gestione degli errori di autenticazione e reindirizzamento alla home dopo il login riuscito.
- `Signup.jsx`: Form per la registrazione di nuovi utenti. Richiede email, password e conferma password, con validazione lato client e chiamata all'API di PocketBase per creare l'account.
- `RequireAuth.jsx`: Componente Higher-Order Component (HOC) che avvolge le route protette. Verifica se l'utente è autenticato; se no, reindirizza alla pagina di login. Utilizza il context di autenticazione per controllare lo stato.
- `AuthContext.jsx`: Context React che fornisce lo stato globale dell'autenticazione. Include funzioni per login, logout e registrazione, oltre a uno stato per l'utente corrente e caricamento.

### Gestione Spese
- `Spese.jsx`: Pagina dedicata alla visualizzazione e gestione delle spese personali. Carica le spese dell'utente dal backend, permette di filtrare per categoria o data, e include pulsanti per aggiungere nuove spese o modificare/eliminare esistenti.
- `AddSpesaModal.jsx`: Modale popup per inserire o modificare una spesa. Contiene un form con campi per titolo, descrizione, importo, data e selezione categoria. Gestisce la validazione e l'invio dei dati a PocketBase.
- `ElencoSpese.jsx`: Componente che rende una lista delle spese filtrate. Ogni spesa è rappresentata da un elemento riutilizzabile, con opzioni per modifica ed eliminazione. Supporta ordinamento e ricerca.

### Gestione Categorie
- `Categorie.jsx`: Pagina per la gestione delle categorie di spesa. Mostra una lista delle categorie dell'utente, con possibilità di aggiungere, modificare o eliminare categorie. Include anche la visualizzazione del colore associato.
- `AddCategoriaModal.jsx`: Modale per creare o aggiornare una categoria. Form con input per nome, descrizione e selezione colore (da una palette predefinita). Valida i dati e salva su PocketBase.

### Grafici e Analisi
- `ElencoGrafici.jsx`: Pagina che aggrega molteplici grafici per l'analisi delle spese. Carica i dati delle spese, li elabora e li passa ai componenti grafici individuali per visualizzazioni interattive.
- `Graphics/CategorySharePie.jsx`: Grafico a torta che mostra la distribuzione percentuale delle spese per categoria. Utilizza la libreria @nivo/pie per rendering, con colori personalizzati basati sulle categorie.
- `Graphics/CategoryYearBar.jsx`: Grafico a barre verticali che rappresenta le spese totali per categoria in un anno selezionato. Permette di esplorare i dati annuali con tooltip informativi.
- `Graphics/TimeSeriesLine.jsx`: Grafico a linee che traccia l'andamento delle spese nel tempo. Mostra serie temporali giornaliere, settimanali o mensili, utile per identificare tendenze.
- `Graphics/CalendarChart.jsx`: Grafico calendario che evidenzia i giorni con spese, con intensità del colore basata sull'importo totale. Basato su @nivo/calendar per una vista annuale.
- `Graphics/SummaryCard.jsx`: Componente che calcola e visualizza statistiche riepilogative, come totale spese del mese corrente, numero di categorie, o spesa media giornaliera.

### Navigazione e Layout
- `Sidebar.jsx`: Barra laterale fissa che fornisce navigazione tra le sezioni dell'app (Home, Spese, Categorie, Grafici). Include anche un pulsante per logout e toggle del tema (chiaro/scuro).
- `Home.jsx`: Pagina di dashboard iniziale. Mostra un riepilogo delle spese recenti, statistiche chiave e collegamenti rapidi alle altre sezioni. Funge da punto di ingresso principale dopo il login.

## API e Servizi

### PocketBase Service (`services/pocketbaseService.js`)
Fornisce funzioni per interagire con PocketBase:
- Autenticazione: login, logout, registrazione.
- CRUD per spese e categorie.
- Query filtrate per utente.

### Utilità
- `categoriaUtils.js`: Funzioni per gestire le categorie (es. colori predefiniti).
- `graphicsUtils.js`: Funzioni per elaborare dati per i grafici.

## Tecnologie Utilizzate

- **Frontend**: React 19, React Router 7, Vite 7.
- **Styling**: TailwindCSS 4, DaisyUI 5.
- **Grafici**: @nivo (bar, calendar, core, funnel, line, pie).
- **Backend**: PocketBase 0.26.
- **Altro**: ESLint per linting, Babel per transpiling.

## Sicurezza

- Autenticazione basata su email e password tramite PocketBase.
- Regole di accesso limitate ai dati dell'utente autenticato.
- Token di sessione gestiti automaticamente.

## Note di Sviluppo

- L'app supporta temi chiaro/scuro tramite attributi data-theme.
- Utilizza React Compiler per ottimizzazioni.
- Build ottimizzato con Vite per prestazioni elevate.

Per ulteriori dettagli o modifiche, consulta il codice sorgente o il README.md.