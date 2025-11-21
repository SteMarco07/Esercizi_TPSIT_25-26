import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

function CreateCards({ list }) {
  return list.map((element, pos) => (
    <ProfileCard
      key={pos}
      name={element.name}
      like={element.like}
      userId={element.id}
    />
  ));
}


function App() {

  const [users, setUsers] = useState([])

  useEffect(() => {
    async function getUsers() {
      try {
        const listUsers = await pb.collection('ProfileCard').getFullList();
        console.log(listUsers);
        setUsers(listUsers);
      } catch (error) {
        console.error('Errore nel caricamento utenti:', error);
      }
    }
    getUsers();
  }, [])


  return (
    <div className="container">
      <h1>Card Profilo Dinamica</h1>
      <CreateCards list={users} />
    </div>
  );
}

export default App; //Questa riga rende disponibile il componente App per essere importato da altri file

// App è un componente funzionale React.
// Significa che restituisce un pezzo di JSX, cioè una combinazione di HTML e JavaScript.
// return contiene il markup dell’interfaccia che verrà visualizzato a schermo.
// All’interno del div:
// <h1> mostra un titolo statico.
// <ProfileCard /> è un componente personalizzato: come se fosse un “tag HTML” creato da te.

// React, quando incontra <ProfileCard />, va a eseguire il codice definito in ProfileCard.jsx e lo inserisce in quella posizione.