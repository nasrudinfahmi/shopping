import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import EditorContextProvider from './context/editorjs/editorContext.jsx'
import UserContextProvider from './context/user/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EditorContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </EditorContextProvider>
  </React.StrictMode>,
)
