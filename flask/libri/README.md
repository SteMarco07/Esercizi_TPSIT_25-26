# Progetto Libreria (Front-end + Back-end)

## Descrizione

Questo progetto è una semplice applicazione di gestione libri composta da due parti:

- Back-end: API REST sviluppata con Flask che fornisce dati fittizi di libri (generati con Faker e faker_books) e supporta operazioni CRUD e ricerca.
- Front-end: applicazione React + Vite che consente di visualizzare, cercare, aggiungere, modificare ed eliminare libri tramite le API.

## Funzionalità principali - Back-end

- Generazione dati: endpoint /api/libri/generate/<count> crea N libri fittizi.
- Lettura: GET /api/libri restituisce tutti i libri.
- Ricerca filtrata: GET /api/libri/search con parametri (id, titolo, autore, editore, genere, anno, isbn).
- Creazione: POST /api/libri per aggiungere un nuovo libro (JSON).
- Aggiornamento: PATCH /api/libri/modify per modificare un libro esistente (invia JSON con campo id).
- Cancellazione: DELETE /api/libri elimina tutti i libri; DELETE /api/libri/<id> elimina uno specifico.

Dettagli tecnici

- Back-end: Flask, Flask-CORS, Faker, faker_books. Avvio: eseguire `main.py` (server su 0.0.0.0:11000 di default).

## Funzionalità principali - Front-end

Il front-end fornisce un'interfaccia web per interagire con le API del back-end. Le funzioni principali offerte all'utente sono:

- Visualizzare la lista dei libri in una vista a griglia con schede che mostrano titolo, autore, editore, genere, anno e ISBN.
- Ricercare libri: campo di ricerca testuale con la possibilità di attivare o disattivare quali campi considerare (es. titolo, autore, anno).
- Aggiungere un nuovo libro tramite un form guidato (con opzione per suggerire dati fittizi).
- Modificare i dettagli di un libro direttamente dalla sua scheda, con conferma delle modifiche.
- Eliminare singoli libri con conferma o cancellare l'intero archivio con conferma preventiva.
- Generare in blocco nuovi libri fittizi per popolare rapidamente la lista.

Comportamento generale:
- Tutte le operazioni CRUD vengono eseguite tramite chiamate al server; il client mantiene lo stato locale della lista e aggiorna la UI dopo ogni operazione.
- L'interfaccia usa modali per i form e le conferme, evitando pagine separate.

Esecuzione rapida del front-end

1. Aprire la cartella `front-end`.
2. Eseguire `npm install` e poi `npm run dev`.
3. Assicurarsi che il back-end sia attivo sulla porta 11000.

## Requisiti

### Requisiti funzionali — MoSCoW

#### Must
- Visualizzare l'elenco dei libri con dettagli principali
- Aggiungere un singolo libro (tramite form)
- Eliminare un singolo libro o tutti i libri (con conferma)
- Eliminare tutti i libri presenti (con conferma)

#### Should
- Modificare i dettagli di un libro (tramite form)
- Visualizzazione in dettaglio di un libro
- Ricerca dei libri (testo + selezione campi)
- Generare in blocco libri
- Suggerire dati per il form di aggiunta

#### Could
- Lista definita dei generi
- Implementazione delle copertine dei libri
- Validazione dei campi e persistenza su DB

#### Won't
- Autenticazione o controllo accessi in questa versione

### Requisiti non funzionali
- Usabilità: interfaccia semplice e accessibile.
- Prestazioni: risposte rapide per operazioni comuni.
- Affidabilità: esiti chiari per operazioni CRUD.
- Sicurezza: sviluppo con CORS abilitato; in produzione usare HTTPS e validazione server-side.
- Manutenibilità: struttura modulare per facilitare estensioni.

## User story

- Come bibliotecario voglio cercare libri usando testo e selezione dei campi in modo da trovare rapidamente titoli o autori da prestare o aggiornare.
  - Criteri di accettazione: la ricerca restituisce risultati rilevanti; posso attivare/disattivare i campi su cui cercare.

- Come studentessa voglio aggiungere un nuovo libro tramite un form in modo da inserire velocemente i volumi utili per il corso.
  - Criteri di accettazione: il form valida i campi essenziali; dopo il salvataggio il libro appare nella lista.

- Come lettore voglio visualizzare le schede dei libri con i dettagli in modo da scegliere quale prendere in prestito.
  - Criteri di accettazione: ogni scheda mostra titolo, autore, editore, anno e ISBN; posso aprire il dettaglio per maggiori informazioni.

- Come responsabile inventario voglio eliminare singoli o più libri in modo da rimuovere rapidamente voci obsolete dal catalogo.
  - Criteri di accettazione: le eliminazioni richiedono conferma; la lista si aggiorna correttamente dopo l'operazione.

- Come tester/demo, voglio generare blocchi di libri fittizi in modo da popolare la lista e verificare il comportamento dell'interfaccia.
  - Criteri di accettazione: la generazione bulk aggiunge i libri al client; l'operazione segnala successo o errore.
