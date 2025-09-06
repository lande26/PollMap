import React, { useEffect, useState, useCallback } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/singup.jsx'
import Home from './pages/Home.jsx'
import Header from './components/Header/Header.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"
import './animations.css'
import './app.css'
import Polls from './pages/polls.jsx'

const Layout = ({ children, showHeader = true }) => {
  return (
    <div className="min-h-screen relative">
      {showHeader && <Header />}
      <div className={showHeader ? "pt-16" : ""}>
        {children}
      </div>
    </div>
  )
}

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
    
    document.body.style.backgroundColor = '#0D1425';
    document.body.style.overflowX = 'hidden';
    
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
          {/* Particles background - absolute positioning */}
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
              particles: {
                color: {
                  value: "#ffffff",
                },
                links: {
                  color: "#4f46e5",
                  distance: 150,
                  enable: true,
                  opacity: 0.3,
                  width: 1,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 1,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 60,
                },
                opacity: {
                  value: 0.4,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 2 },
                },
              },
              detectRetina: true,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1
            }}
          />
          
          {/* Main content */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <Layout showHeader={true}>
                  <Home />
                </Layout>
              } />
              
              <Route path="/login" element={
                <Layout showHeader={false}>
                  <Login />
                </Layout>
              } />
              
              <Route path="/signup" element={
                <Layout showHeader={false}>
                  <Signup />
                </Layout>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout showHeader={true}>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout showHeader={true}>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/bookmarks" element={
                <ProtectedRoute>
                  <Layout showHeader={true}>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-2xl text-white">
                        Bookmarks Page - Under Construction
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/polls" element={
                <ProtectedRoute>
                  <Layout showHeader={true}>
                    <Polls />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
}

export default App