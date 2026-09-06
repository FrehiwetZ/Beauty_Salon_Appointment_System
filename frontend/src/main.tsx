import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NavigationProvider } from './context/NavigationContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { DataProvider } from './context/DataContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import { BrandingProvider } from './context/BrandingContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <NavigationProvider>
        <AuthProvider>
          <DataProvider>
            <ToastProvider>
              <BrandingProvider>
                <App />
              </BrandingProvider>
            </ToastProvider>
          </DataProvider>
        </AuthProvider>
      </NavigationProvider>
    </LanguageProvider>
  </StrictMode>,
)