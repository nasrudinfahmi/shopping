import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import EditorContextProvider from './context/editorjs/editorContext.jsx'
import UserContextProvider from './context/user/UserContext.jsx'
import StoreContextProvider from './context/store/StoreContext.jsx'
import SellerContextProvider from './context/seller/SellerContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EditorContextProvider>
      <UserContextProvider>
        <SellerContextProvider>
          <StoreContextProvider>
            <App />
          </StoreContextProvider>
        </SellerContextProvider>
      </UserContextProvider>
    </EditorContextProvider>
  </React.StrictMode>,
)
