import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { AuthModalProvider } from './context/AuthModalContext.jsx'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AuthModalProvider>
          <App />
        </AuthModalProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
