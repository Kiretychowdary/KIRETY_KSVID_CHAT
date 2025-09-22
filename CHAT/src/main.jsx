import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global polyfills for WebRTC libraries
import { Buffer } from 'buffer'
import process from 'process'

window.global = globalThis
window.Buffer = Buffer
window.process = process

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
