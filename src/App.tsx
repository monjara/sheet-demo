import './App.css'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'

function App() {
  const routes = [
    { to: 'spreadsheet', label: 'SpreadSheet' },
    { to: 'data_grid', label: 'DataGrid' },
    { to: 'canvas_datagrid', label: 'CanvasDataGrid' },
  ]
  const location = useLocation()
  if (location.pathname === '/') {
    return <Navigate to='/spreadsheet' replace />
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
