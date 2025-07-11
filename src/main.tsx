import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QuizzesProvider } from './contexts/QuizzesContext.tsx'
import { BuilderProvider } from './contexts/BuilderContext.tsx'

createRoot(document.getElementById('root')!).render(
 

    <StrictMode>
      <QuizzesProvider>
        <BuilderProvider>
          <App />
        </BuilderProvider>
      </QuizzesProvider>
    </StrictMode>,

  
)
