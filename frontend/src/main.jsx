import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ERPProvider } from './context/ERPContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ERPProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ERPProvider>
  </React.StrictMode>,
)
