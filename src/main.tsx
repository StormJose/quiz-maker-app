import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QuizzesProvider } from './contexts/QuizzesContext.tsx'
import { AuthProvider } from "./contexts/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QuizzesProvider>
        <App />
      </QuizzesProvider>
    </AuthProvider>
  </StrictMode>
);
