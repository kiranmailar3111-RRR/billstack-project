import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import AppRoutes from './routes/AppRoutes'
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
)