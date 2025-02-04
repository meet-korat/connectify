import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import store,{persistor} from './store/userStore.js'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import "./index.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

      <BrowserRouter>

        <PersistGate persistor={persistor}>
        <App />
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
