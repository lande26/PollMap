import React, { useEffect, useState, useCallback } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/singup.jsx'
import Home from './pages/Home.jsx'
import Header from './components/Header/Header.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"
import './animations.css'
import './app.css'

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const client = new QueryClient()

  const handleMouseMovement = (event) => {
    const { clientX, clientY } = event
    setMousePosition({ x: clientX, y: clientY })
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--mouse-x', mousePosition.x)
    document.documentElement.style.setProperty('--mouse-y', mousePosition.y)
    window.addEventListener('mousemove', handleMouseMovement)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMovement)
    }
  }, [mousePosition])

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async container => {
    await console.log(container)
  }, [])

  return (
    <>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <BrowserRouter>
            <Particles
              id="tsparticles"
              init={particlesInit}
              loaded={particlesLoaded}
              options={{
                background: {
                  color: {
                    value: "transparent",
                  },
                },
                fpsLimit: 120,
                interactivity: {
                  events: {
                    onClick: {
                      enable: false,
                      mode: "push",
                    },
                    onHover: {
                      enable: true,
                      mode: "repulse",
                    },
                    resize: true,
                  },
                  modes: {
                    push: {
                      quantity: 0,
                    },
                    repulse: {
                      distance: 100,
                      duration: 0.4,
                    },
                  },
                },
                particles: {
                  color: {
                    value: "#ffffff",
                  },
                  links: {
                    color: "#4f46e5",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                  },
                  move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                      default: "bounce",
                    },
                    random: false,
                    speed: 2,
                    straight: false,
                  },
                  number: {
                    density: {
                      enable: true,
                      area: 800,
                    },
                    value: 80,
                  },
                  opacity: {
                    value: 0.5,
                  },
                  shape: {
                    type: "circle",
                  },
                  size: {
                    value: { min: 1, max: 3 },
                  },
                },
                detectRetina: true,
              }}
              className="fixed top-0 left-0 w-full h-full -z-10"
            />
            
            <Routes>
              <Route path="/" element={
                <>
                  <Header />
                  <Home />
                </>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
}

export default App