import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//function Saluta(props) {
//  console.log(props)
//  const nome = props.nome
//  return (
//    <>
//      <p>Ciao, {nome}</p>
//    </>
//  )
//}

function Saluta({nome, pippo}) {
  console.log(nome)
  return (
    <>
      <p>Ciao, {nome} {pippo}</p>
    </>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>titolo</h1>
      <Saluta nome="Marco" pippo={count}/>
      <button className="btn btn-primary">Button</button>
    </>
  )
}

export default App
