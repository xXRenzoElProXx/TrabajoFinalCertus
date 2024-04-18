import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppPrincipal } from './AppPrincipal'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <React.StrictMode>
      <AppPrincipal />
    </React.StrictMode>

  </BrowserRouter>
)
