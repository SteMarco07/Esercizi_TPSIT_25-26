import React from 'react'

export default function NavBar({ showGrafici, setShowGrafici }) {
  return (
    <header id="app_header">
      <div className="nav-row">
        <div>
          <h1 className="app-title">Tracker Spese</h1>
        </div>
        <button
          className="btn btn-sm btn-primary"
          aria-controls="grafici_section"
          aria-expanded={showGrafici}
          onClick={() => setShowGrafici(s => !s)}
        >
          {showGrafici ? 'Nascondi grafici' : 'Mostra grafici'}
        </button>
      </div>
    </header>
  )
}
