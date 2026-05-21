import { useEffect, useState } from 'react'
import { trackAnalyticsEvent } from './AnalyticsTracker'

const INITIAL_FORM = {
  firstName: '',
  email: '',
  consent: false,
}

export default function NewsletterPopup({ isOpen, onClose, onSuccess, source = 'website' }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose('dismissed')
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM)
      setErrors({})
      setSubmitMessage('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleChange = ({ target }) => {
    const { name, type, checked, value } = target
    const nextValue = type === 'checkbox' ? checked : value

    setForm(current => ({ ...current, [name]: nextValue }))
    setErrors(current => {
      if (!current[name]) {
        return current
      }

      const next = { ...current }
      delete next[name]
      return next
    })
    setSubmitMessage('')
  }

  const validate = () => {
    const nextErrors = {}

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!form.consent) {
      nextErrors.consent = 'Please confirm you want email updates.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          consent: form.consent,
          source,
        }),
      })

      const raw = await response.text()
      const result = raw ? JSON.parse(raw) : {}

      if (!response.ok || !result.ok) {
        const fallbackMessage = response.status === 404
          ? 'Newsletter signup is not available in this local dev server yet. Test it on the deployed site or with the server runtime configured.'
          : 'Unable to save your subscription.'

        throw new Error(result.error || result.message || fallbackMessage)
      }

      setSubmitMessage('You are subscribed. We will send design updates and project inspiration soon.')
      setForm(INITIAL_FORM)
      setErrors({})
      trackAnalyticsEvent('newsletter_subscribe_success', {
        source,
      })
      onSuccess?.()
    } catch (error) {
      setSubmitMessage(error.message || 'We could not process your subscription right now. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="newsletter-overlay"
      role="presentation"
      onClick={event => {
        if (event.target === event.currentTarget) {
          onClose('dismissed')
        }
      }}
    >
      <div className="newsletter-modal" role="dialog" aria-modal="true" aria-labelledby="newsletter-popup-title">
        <button type="button" className="newsletter-close" onClick={() => onClose('dismissed')} aria-label="Close newsletter signup">
          x
        </button>

        <div className="newsletter-copy">
          <p className="newsletter-kicker">Classic Stone Insider</p>
          <h2 id="newsletter-popup-title" className="newsletter-title">Get project inspiration and stone design updates.</h2>
          <p className="newsletter-text">
            Subscribe for renovation ideas, featured materials, and practical planning notes from the Classic Stone team.
          </p>
          <ul className="newsletter-points" aria-label="Newsletter benefits">
            <li>New project highlights from Virginia homes</li>
            <li>Material spotlights and maintenance tips</li>
            <li>Planning advice before your consultation</li>
          </ul>
        </div>

        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          <div className="newsletter-field">
            <label htmlFor="newsletter-first-name">First Name</label>
            <input
              id="newsletter-first-name"
              name="firstName"
              type="text"
              placeholder="Jane"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="newsletter-field">
            <label htmlFor="newsletter-email">Email</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="jane@email.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="sc-error">{errors.email}</span>}
          </div>

          <label className="newsletter-consent">
            <input
              name="consent"
              type="checkbox"
              checked={form.consent}
              onChange={handleChange}
            />
            <span>I agree to receive email updates from Classic Stone.</span>
          </label>
          {errors.consent && <span className="sc-error">{errors.consent}</span>}

          <button type="submit" className="btn btn-fill newsletter-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Subscribing...' : 'Join the List'}
          </button>

          {submitMessage && <p className="newsletter-submit-message">{submitMessage}</p>}
        </form>
      </div>
    </div>
  )
}
