import { useState } from 'react'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  projectType: '',
  vision: '',
}

export default function Footer() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = ({ target }) => {
    const { name, value } = target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
    setSubmitMessage('')
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required.'
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required.'
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!/^\+?[\d\s().-]{7,}$/.test(form.phone)) nextErrors.phone = 'Enter a valid phone number.'
    if (!form.projectType) nextErrors.projectType = 'Select a project type.'
    if (!form.vision.trim()) nextErrors.vision = 'Tell us a bit about your project.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      })

      const raw = await response.text()
      const result = raw ? JSON.parse(raw) : {}

      if (!response.ok || !result.ok) {
        const fallbackMessage = response.status === 404
          ? 'Contact form service is not available in this local dev server yet. Test it on the deployed site or with the server runtime configured.'
          : 'Unable to send message.'

        throw new Error(result.error || result.message || fallbackMessage)
      }

      setSubmitMessage('Message sent successfully. We will get back to you shortly.')
      setForm(INITIAL_FORM)
      setErrors({})
    } catch (error) {
      setSubmitMessage(error.message || 'We could not send your message right now. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <p className="section-label">Get In Touch</p>
              <h2 className="section-title">Let's build something lasting.</h2>
              <div className="divider" />
              <p>
                Whether you have a plot of land and a dream, or just a few ideas scrawled on a
                napkin — we'd love to hear from you. Consultations are always free.
              </p>
              <div className="contact-detail">
                <span className="contact-detail-label">Phone</span>
                <span className="contact-detail-val">(202) 227-0788</span>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-label">Email</span>
                <span className="contact-detail-val">Classicstoneva@gmail.com</span>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-label">Location</span>
                <span className="contact-detail-val">
                  Serving Arlington,Fairfax of Virginia<br />Office: Arlington, VA
                </span>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="firstName" type="text" placeholder="Jane" value={form.firstName} onChange={handleChange} />
                  {errors.firstName && <span className="sc-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lastName" type="text" placeholder="Doe" value={form.lastName} onChange={handleChange} />
                  {errors.lastName && <span className="sc-error">{errors.lastName}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" placeholder="jane@email.com" value={form.email} onChange={handleChange} />
                  {errors.email && <span className="sc-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" type="tel" placeholder="(540) 555-0000" value={form.phone} onChange={handleChange} />
                  {errors.phone && <span className="sc-error">{errors.phone}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Project Type</label>
                <select name="projectType" value={form.projectType} onChange={handleChange}>
                  <option value="">Select one...</option>
                  <option>New Home Build</option>
                  <option>Land + Build Package</option>
                  <option>Addition or Renovation</option>
                  <option>Stone &amp; Masonry Work</option>
                  <option>Just Exploring – Schedule a Call</option>
                </select>
                {errors.projectType && <span className="sc-error">{errors.projectType}</span>}
              </div>
              <div className="form-group">
                <label>Tell Us About Your Vision</label>
                <textarea
                  name="vision"
                  placeholder="Share your ideas, location, timeline, or any questions..."
                  value={form.vision}
                  onChange={handleChange}
                />
                {errors.vision && <span className="sc-error">{errors.vision}</span>}
              </div>
              <div>
                <button type="submit" className="btn btn-fill" style={{ cursor: isSubmitting ? 'wait' : 'pointer' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send My Message'}
                </button>
                {submitMessage && <p className="contact-submit-message">{submitMessage}</p>}
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Classic Stone Design & Build · Arlington, Virginia · All Rights Reserved</p>
      </footer>
    </>
  )
}
