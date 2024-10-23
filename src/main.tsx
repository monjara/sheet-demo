import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import CanvasDataGrid from './features/canvas_datagrid/index.tsx'
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
      {
        path: '/canvas_datagrid',
        element: <CanvasDataGrid />,
      },
    ],
  },
])

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
