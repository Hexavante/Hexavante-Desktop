import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './styles/globals.css'

function renderApp() {
  try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  } catch (err) {
    document.documentElement.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#06080f;color:#f8fafc;font-family:sans-serif;padding:2rem;">
        <div style="text-align:center;">
          <h1 style="font-size:1.5rem;margin-bottom:0.5rem;">Erro ao iniciar</h1>
          <p style="color:#94a3b8;">Ocorreu um erro inesperado. Tente reiniciar o aplicativo.</p>
        </div>
      </div>
    `
    console.error('Fatal render error:', err)
  }
}

renderApp()
