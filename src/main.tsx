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
          <p style="color:#94a3b8;">${err instanceof Error ? err.message : 'Erro desconhecido'}</p>
          <pre style="margin-top:1rem;padding:1rem;background:rgba(255,255,255,0.05);border-radius:0.5rem;text-align:left;font-size:0.75rem;color:#94a3b8;max-width:600px;overflow:auto;">${err instanceof Error ? err.stack : ''}</pre>
        </div>
      </div>
    `
    console.error('Fatal render error:', err)
  }
}

renderApp()
