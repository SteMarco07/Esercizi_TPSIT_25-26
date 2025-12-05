import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-base-300 to-base-200 shadow-lg">
      <div className="p-4 border-b border-base-content/10">
        <h2 className="text-xl font-bold text-primary">Spese Tracker</h2>
      </div>
      <ul className="menu p-4">
        <li className="mb-2">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100 transition-colors">
            <span className="text-lg">🏠</span>
            <span>Home</span>
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/spese" className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100 transition-colors">
            <span className="text-lg">💰</span>
            <span>Spese</span>
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/categorie" className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100 transition-colors">
            <span className="text-lg">📂</span>
            <span>Categorie</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
