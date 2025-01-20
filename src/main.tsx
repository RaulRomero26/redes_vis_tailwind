import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NetworkProvider } from "./context/NetwokrContext";
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/Error/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NetworkProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </NetworkProvider>
  </StrictMode>,
)
