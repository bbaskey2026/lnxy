import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import './index.css'
import App from './App.jsx'
import { store } from './store'
import { theme } from './themes/theme'
import ErrorBoundary from './components/ErrorBoundary'
import { restoreSession } from './store/slices/authSlice'

store.dispatch(restoreSession())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ReduxProvider>
    </ErrorBoundary>
  </StrictMode>,
)
