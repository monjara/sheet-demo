import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import DataGridIndex from './features/data_grid/index.tsx'
import SpreadSheet from './features/spreadsheet/index.tsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        path: '/spreadsheet',
        element: <SpreadSheet />,
      },
      {
        path: '/data_grid',
        element: <DataGridIndex />,
      },
    ],
  },
])

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
