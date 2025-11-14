import { useEffect, useState } from "react";   //useState è un Hook di React, cioè una funzione speciale che ti
// permette di aggiungere stato a un componente funzionale.

function ProfileCard({ name = "Mario Rossi", like = 0, userId }) {
  //Stato per il nome
  const [nome, setNome] = useState(name);
  const [id, setid] = useState(userId)
  const [userLike, setUserLike] = useState(like)

  useEffect(()=> {
    fetch(`http://127.0.0.1:8090/api/collections/ProfileCard/records/${id}`, {
      method: "PATCH",
      body: JSON.stringify({like:userLike})
    })

  }, [userLike])

  // Handler per cambiare nome
  async function handleNameChange(event) {
    setNome(event.target.value);
  }


  // Handler per aggiungere like
  function handleLikeClick() {
    setLikes(likesPrecedenti => likesPrecedenti + 1);
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
