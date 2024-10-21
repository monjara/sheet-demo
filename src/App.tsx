import './App.css'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'

function App() {
  const routes = [{ to: 'spreadsheet', label: 'SpreadSheet' }]
  const location = useLocation()
  if (location.pathname === '/') {
    return <Navigate to='/spreadsheet' replace />
  }

  return (
    <div className='app'>
      <div className='side_bar'>
        <ul>
          {routes.map((route) => (
            <Link key={route.to} to={route.to}>
              {route.label}
            </Link>
          ))}
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default App
