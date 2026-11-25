import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { AppFeedbackContext } from './AppFeedbackContext'
import './AppFeedback.css'

export function AppFeedbackProvider({ children }) {
  const nextId = useRef(0)
  const [feedback, setFeedback] = useState(null)

  const showToast = (message, severity = 'success') => {
    nextId.current += 1
    setFeedback({ id: nextId.current, message, severity, duration: 4500, type: 'toast' })
  }

  const showSnackbar = (message, { actionLabel, onAction, duration = 6000 } = {}) => {
    nextId.current += 1
    setFeedback({ id: nextId.current, message, actionLabel, onAction, duration, type: 'snackbar' })
  }

  useEffect(() => {
    if (!feedback) return undefined
    const timeout = window.setTimeout(() => setFeedback(null), feedback.duration)
    return () => window.clearTimeout(timeout)
  }, [feedback])

  const closeFeedback = () => setFeedback(null)

  return (
    <AppFeedbackContext.Provider value={{ showToast, showSnackbar }}>
      {children}
      {feedback && (
        <div
          key={feedback.id}
          className={`app-feedback app-feedback-${feedback.type}${feedback.type === 'toast' ? ` app-feedback-${feedback.severity}` : ''}`}
          role={feedback.severity === 'error' ? 'alert' : 'status'}
          aria-live={feedback.severity === 'error' ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          <span className="app-feedback-message">{feedback.message}</span>
          {feedback.actionLabel && (
            <button
              type="button"
              className="app-feedback-action"
              onClick={() => {
                feedback.onAction?.()
                closeFeedback()
              }}
            >
              {feedback.actionLabel}
            </button>
          )}
          <button type="button" className="app-feedback-close" aria-label="Dismiss notification" onClick={closeFeedback}>
            <X size={18} />
          </button>
        </div>
      )}
    </AppFeedbackContext.Provider>
  )
}
