import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import store from './store/index.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#10B981',
                secondary: '#059669',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#EF4444',
                secondary: '#DC2626',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
) 