import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Preview from './features/grid/preview'
import Layout from './features/wrapper/layout'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/preview',
          element: <Preview />,
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
