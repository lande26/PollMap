import React, { StrictMode } from 'react'
import {Routes, Route,BrowserRouter} from 'react-router-dom'
import './index.css'
import Login from './pages/login.jsx'
import Signup from './pages/singup.jsx'
import Home from './pages/Home.jsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.jsx'
import Header from './components/Header/Header.jsx'
import './app.css'
import Dashboard from './pages/Dashboard.jsx'
function App() {

  const client = new QueryClient();
  return (
    <>
    <QueryClientProvider client={client}>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
          <Header />
          <Home />
          </>
          } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <>
          <Dashboard />
          </>
          } />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
    </>
  )
}

export default App
