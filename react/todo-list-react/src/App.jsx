import { useState } from 'react'
import './App.css'

function NavBar() {
  return (
    <div className="navbar bg-base-100 shadow-lg navbar-simple-top elemento-centrato">
      <div className="flex-none">
        <div className="dropdown">
          <div tabIndex="0" role="button" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </div>
          <ul tabIndex="0"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a href="#/" data-route="/" data-i18n="nav.home">Home</a></li>
            <li><a href="#/backlog" data-route="/backlog" data-i18n="nav.backlog">Backlog</a></li>
            <li><a href="#/in_progress" data-route="/in_progress" data-i18n="nav.in_progress">In Progress</a>
            </li>
            <li><a href="#/review" data-route="/review" data-i18n="nav.review">Review</a></li>
            <li><a href="#/done" data-route="/done" data-i18n="nav.done">Done</a></li>
          </ul>
        </div>
      </div>

      <div className="flex-1 ml-2">
        <span className="text-xl font-semibold" data-i18n="app.title">Jotly</span>
      </div>

      <label className="input bg-base-200" style={{ width: '25em' }}>
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 24">
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" required placeholder="Cerca note..." id="input-ricerca"
          data-i18n-placeholder="home.searchPlaceholder" />
      </label>

      <div className="flex-none ml-4">
        <div className="dropdown dropdown-end">
          <div tabIndex="0" role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul tabIndex="0"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1000] mt-3 w-52 p-2 shadow">
            <li><a href="#/profile" data-i18n="nav.profile">Profile</a></li>
            <li><a href="#/settings" data-i18n="nav.settings">Settings</a></li>
            <li><a href="#/auth" data-i18n="nav.logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Card({ title = "Card Title", description = "A card component has a figure, a body part, and inside body there are title and actions parts" }) {
  return (
    <div className="card w-full bg-base-100 card-lg shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-base">{title}</h2>
        <p className='text-sm'>{description}</p>
        <div className="card-actions flex-row justify-center gap-2">
          <button className="btn btn-info btn-outline btn-sm btn-sposta">Sposta</button>
          <button className="btn btn-error btn-outline btn-sm btn-elimina">Elimina</button>
        </div>
      </div>
    </div>
  );
}

function CreaCards({ list }) {
  html = ""
  for (const element of list) {
      html += Card(element.title, element.description)
  }
  return html;
}

function Colonna({ id, title }) {
  return (
    <div id={id} className="todo-list">
      <div className="div-title">{title}</div>
      <div className="todo-list-content">
        <Card
          title="Task di esempio"
          description={`Questo è un task nella colonna ${title}`}
        />
      </div>
    </div>
  );
}

function AppContent() {
  return (<>
    <div className="todo-div elemento-centrato">
      <Colonna id='backlog' title='Backlog' />
      <Colonna id='in_progress' title='in_progress' />
      <Colonna id='done' title='done' />
      <Colonna id="review" title='review' />
    </div>

  </>);
}

function App() {
  return (
    <>
      <AppContent />
    </>
  )
}

export default App
