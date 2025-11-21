import { useEffect, useState } from "react";   //useState è un Hook di React, cioè una funzione speciale che ti
// permette di aggiungere stato a un componente funzionale.
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

function ProfileCard({ name = "Mario Rossi", like = 0, userId }) {
  //Stato per il nome
  const [nome, setNome] = useState(name);
  const [id, setid] = useState(userId)
  const [userLike, setUserLike] = useState(like)




  useEffect(() => {

    if (userLike === like) return;

    const timer = setTimeout(async () => {
      try {
        const data = {
          "like": userLike
        };
        await pb.collection('ProfileCard').update(userId, data);
      } catch (error) {
        console.error('Errore aggiornamento like:', error);
      }
    }, 500); // Aspetta 500ms prima di inviare la richiesta

    return () => clearTimeout(timer); // Cleanup del timer
  }, [userLike, userId, like])


  useEffect(() => {

    if (nome === name) return;

    const timer = setTimeout(async () => {
      try {
        const data = {
          "name": nome
        };
        await pb.collection('ProfileCard').update(userId, data);
      } catch (error) {
        console.error('Errore aggiornamento nome:', error);
      }
    }, 1000);

    return () => clearTimeout(timer); // Cleanup del timer
  }, [nome, userId, name])

  // Handler per cambiare nome
  async function handleNameChange(event) {
    setNome(event.target.value);
  }


  // Handler per aggiungere like
  function handleLikeClick() {
    setUserLike(likesPrecedenti => likesPrecedenti + 1);
  }


  function getData() {
    return {
      "name": name,
      "like": like
    };

  }

  return (
    <div className="profile-card">
      <h2>Profilo di: {nome}</h2>

      <p>Scrivi per cambiare il nome:</p>
      <input type="text" value={nome} onChange={handleNameChange} />

      <hr />

      <button onClick={handleLikeClick}>❤️ Like ({userLike})</button>

      <hr />

    </div>
  );
}

export default ProfileCard;
