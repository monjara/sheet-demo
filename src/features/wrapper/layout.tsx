import { Navigate, Outlet, useLocation } from 'react-router-dom'
import styles from './layout.module.css'

export default function Layout() {
  const location = useLocation()
  if (location.pathname === '/') {
    return <Navigate to='/preview' replace />
  }

  return (
    <div className={styles.container}>
      <div className={styles.side_bar} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
