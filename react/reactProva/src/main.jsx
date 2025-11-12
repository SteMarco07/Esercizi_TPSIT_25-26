import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App";   //Ogni livello contiene il successivo
import "./App.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
createRoot(document.getElementById('root')).render(  //trova il div nell’index.html e disegna <App /> dentro quel div
  <StrictMode>
    <App />
  </StrictMode>,
)

//Quindi: main.jsx collega React al browser.


// “Trova nel documento HTML il div con id root, crea in esso un’istanza React e mostra al suo interno
//  il componente principale <App />, con controlli aggiuntivi attivi (StrictMode).”