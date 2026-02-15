import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './index.css' // We don't have global styles yet

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
