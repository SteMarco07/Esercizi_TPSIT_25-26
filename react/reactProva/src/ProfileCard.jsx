import { useState } from "react";   //useState è un Hook di React, cioè una funzione speciale che ti
// permette di aggiungere stato a un componente funzionale.

function ProfileCard({name = "Mario Rossi", nLike = 0}) {
  //Stato per il nome
  const [nome, setNome] = useState(name);

  /*
  React crea una variabile di stato chiamata nome, inizializzata con il valore "Mario Rossi".
  setNome è la funzione che aggiorna quello stato.
  La sintassi con le parentesi quadre è una destructuring assignment:
  useState restituisce un array con due elementi:
  -il valore corrente dello stato (nome)
  -la funzione per modificarlo (setNome)
  Quando chiami setNome(...), React non cambia subito la variabile: pianifica un re-render, cioè ridisegna il componente con il nuovo valore.
  */

  // Stato per i like
  const [likes, setLikes] = useState(nLike);

  /*
Stesso meccanismo, ma il valore iniziale è 0.
likes contiene il numero attuale di like,
setLikes serve per incrementarlo.
*/

  // Handler per cambiare nome
  function handleNameChange(event) {
    setNome(event.target.value);
  }

  /*
  Viene eseguito ogni volta che l’utente scrive qualcosa nell’input.
event.target.value è il contenuto digitato.
setNome(...) aggiorna lo stato → React ridisegna il componente →
{nome} nel <h2> cambia immediatamente sullo schermo.
È un classico esempio di two-way binding: ciò che scrivi nell’input si riflette nel testo sopra.
  */

  // Handler per aggiungere like
  function handleLikeClick() {
    setLikes(likesPrecedenti => likesPrecedenti + 1);
  }

  /*
    Ogni clic sul bottone chiama handleLikeClick.
    Usa la forma funzionale di setLikes per sicurezza: riceve il valore precedente e restituisce quello nuovo.
    (Evita problemi se React deve aggiornare più stati insieme.)
    Ogni volta che setLikes viene chiamato:
        React aggiorna lo stato.
        Esegue di nuovo il rendering.
        Mostra il nuovo numero di like.
  */

  return (
    <div className="profile-card">
      <h2>Profilo di: {nome}</h2>

      <p>Scrivi per cambiare il nome:</p>
      <input type="text" value={nome} onChange={handleNameChange} />

      <hr />

      <button onClick={handleLikeClick}>❤️ Like ({likes})</button>

      <hr />

    </div>
  );
}

export default ProfileCard;
