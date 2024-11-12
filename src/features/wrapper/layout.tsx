import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import styles from './layout.module.css'

export default function Layout() {
  const [isWide, setIsWide] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const handler = () => {
      setIsWide(window.innerWidth > 800)
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  if (location.pathname === '/') {
    return <Navigate to='/preview' replace />
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.side_bar} ${
          isWide ? styles.wide_side_bar : styles.thin_side_bar
        }`}
      >
        {isWide ? (
          <button
            type='button'
            className={styles.text_button}
            onClick={() => setIsWide(false)}
          >
            ←
          </button>
        ) : (
          <button
            type='button'
            className={styles.text_button}
            onClick={() => setIsWide(true)}
          >
            →
          </button>
        )}
      </div>
      <div className={isWide ? styles.content : styles.thin_content}>
        <Outlet />
      </div>
    </div>
  )
}
