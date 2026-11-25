import { useContext } from 'react'
import { AppFeedbackContext } from '../components/AppFeedbackContext'

export function useAppFeedback() {
  const context = useContext(AppFeedbackContext)
  if (!context) throw new Error('useAppFeedback must be used within AppFeedbackProvider')
  return context
}
