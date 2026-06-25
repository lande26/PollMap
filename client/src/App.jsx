import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './animations.css'
import './App.css'
import './index.css'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { router } from './router.jsx'
import AppBackground from './components/ui/AppBackground.jsx'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketContextProvider>
        <div className="relative min-h-screen">
          <AppBackground />
          <div className="relative z-10">
            <RouterProvider router={router} />
          </div>
        </div>
      </SocketContextProvider>
    </QueryClientProvider>
  )
}

export default App
