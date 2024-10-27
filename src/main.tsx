import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import RowColumnsGrid from './features/grid/index.tsx'
import './index.css'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          path: '/rows_columns',
          element: <RowColumnsGrid />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL ?? '/sheet-demo/',
  }
)

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
