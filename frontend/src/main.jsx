import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// This file bootstraps the React application by mounting <App /> into the 'root' DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
