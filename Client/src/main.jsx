import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { JobProvider } from './context/JobContext.jsx'

import { store } from './app/store.js'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
       <AuthProvider>
      <JobProvider>
          <App />
      </JobProvider>    
    </AuthProvider>
    </Provider>
   
  </React.StrictMode>,
)
