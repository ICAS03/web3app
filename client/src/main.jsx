import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TransactionProvider } from './context/TransactionsContext.jsx'

createRoot(document.getElementById('root')).render(
  <TransactionProvider>
    <App />
  </TransactionProvider>,
)
