import { AppRoutes } from './routes/AppRoutes'
import ScrollToTop from './components/ScrollToTop'
import { AppFeedbackProvider } from './components/AppFeedback'
import './App.css'

function App() {
  return (
    <AppFeedbackProvider>
      <ScrollToTop />
      <AppRoutes />
    </AppFeedbackProvider>
  )
}

export default App
