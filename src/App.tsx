import './App.css'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'

function App() {
  const routes = [{ to: 'rows_columns', label: 'RowsColumns' }]
  const location = useLocation()
  if (location.pathname === '/') {
    return <Navigate to={`${routes[0].to}`} replace />
  }

  return (
    <div className='app'>
      <div className='side_bar'>
        {routes.map((route) => (
          <Link key={route.to} to={route.to}>
            {route.label}
          </Link>
        ))}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default App
