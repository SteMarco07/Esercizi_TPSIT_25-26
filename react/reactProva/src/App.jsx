import ProfileCard from "./ProfileCard";

const userList = [
  { nome: "Marco Bianchi", like: 25 },
  { nome: "Sofia Rossi", like: 42 },
  { nome: "Alessandro Verde", like: 18 },
  { nome: "Giulia Ferrari", like: 67 },
  { nome: "Lorenzo Marino", like: 33 }
];

function CreateCards ({list}) {
  return list.map((element) => (
    <ProfileCard 
      name={element.nome} 
      nLike={element.like}
    />
  ));
}


function App() {
  return (
    <div className="container">
      <h1>Card Profilo Dinamica</h1>
      <CreateCards list={userList} />
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