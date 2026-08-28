import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NavigationProvider } from './context/NavigationContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { DataProvider } from './context/DataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavigationProvider>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </NavigationProvider>
  </StrictMode>,
)