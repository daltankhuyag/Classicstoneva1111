import { useEffect, useState } from 'react'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  projectType: '',
  vision: '',
}

const PRIVACY_POLICY_SECTIONS = [
  {
    title: 'Information We Collect',
    paragraphs: ['We may collect certain personal information that you voluntarily provide, including:'],
    items: ['Name', 'Email address', 'Phone number', 'Project or inquiry details'],
  },
  {
    title: '',
    paragraphs: ['We may also automatically collect non-personal information such as:'],
    items: ['IP address', 'Browser type', 'Device information', 'Website usage data through cookies or analytics tools'],
  },
  {
    title: 'How We Use Your Information',
    paragraphs: ['We use collected information to:'],
    items: [
      'Respond to inquiries and requests',
      'Improve website performance and user experience',
      'Provide services and customer support',
      'Send updates or communications if requested',
      'Maintain website security',
    ],
  },
  {
    title: 'Cookies and Tracking Technologies',
    paragraphs: ['This website may use cookies and similar technologies to enhance user experience and analyze website traffic. You can adjust your browser settings to refuse cookies if preferred.'],
  },
  {
    title: 'Information Sharing',
    paragraphs: ['We do not sell, rent, or trade your personal information to third parties. Information may only be shared when required by law or necessary to provide requested services.'],
  },
  {
    title: 'Data Security',
    paragraphs: ['We take reasonable measures to protect your information from unauthorized access, disclosure, or misuse. However, no internet transmission or electronic storage method is completely secure.'],
  },
  {
    title: 'Third-Party Links',
    paragraphs: ['This website may include links to third-party websites. We are not responsible for the privacy practices or content of those websites.'],
  },
  {
    title: 'Children’s Privacy',
    paragraphs: ['This website is not intended for children under the age of 13, and we do not knowingly collect personal information from children.'],
  },
  {
    title: 'Changes to This Policy',
    paragraphs: ['We reserve the right to update or modify this Privacy Policy at any time. Changes will be posted on this page with an updated effective date.'],
  },
  {
    title: 'Contact Information',
    paragraphs: ['If you have questions regarding this Privacy Policy, please contact us through the website’s contact page.'],
  },
]

const LEGAL_STATEMENT_SECTIONS = [
  {
    title: 'Legal Statement',
    paragraphs: [
      'Welcome to this website. By accessing or using this site, you agree to comply with and be bound by the following terms and conditions. All content, materials, logos, text, images, and information provided on this website are for general informational purposes only and are the property of the website owner unless otherwise stated.',
      'The information provided on this website is offered “as is” without warranties of any kind, either express or implied. While we strive to keep all information accurate and up to date, we make no guarantees regarding completeness, reliability, suitability, or availability.',
      'Under no circumstances shall the website owner, affiliates, employees, or representatives be liable for any direct, indirect, incidental, consequential, or special damages arising out of or related to the use of this website or reliance on its content.',
      'This website may contain links to third-party websites for convenience and informational purposes. We do not endorse or assume responsibility for the content, policies, or practices of any third-party sites.',
      'Unauthorized use, reproduction, or distribution of any materials from this website without prior written permission is prohibited.',
      'We reserve the right to modify, update, or remove content and policies at any time without prior notice.',
      'If you have any questions regarding this legal statement, please contact us through the website’s contact page.',
    ],
  },
]

export default function Footer() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeFooterDialog, setActiveFooterDialog] = useState(null)

  useEffect(() => {
    if (!activeFooterDialog) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setActiveFooterDialog(null)
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeFooterDialog])

  const dialogContent = activeFooterDialog === 'legal'
    ? {
        kicker: 'Legal Statement',
        title: 'Please review the legal terms for using this website.',
        intro: 'These terms describe how website content is provided and the limits that apply when using this site.',
        sections: LEGAL_STATEMENT_SECTIONS,
        footerNote: 'Effective date: May 16, 2026',
      }
    : {
        kicker: 'Privacy Policy',
        title: 'Your privacy is important to us.',
        intro: 'This Privacy Policy explains how we collect, use, and protect information when you visit and use this website.',
        sections: PRIVACY_POLICY_SECTIONS,
        footerNote: 'Effective date: May 16, 2026',
      }

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
        <div className="footer-links">
          <button type="button" className="footer-link-btn" onClick={() => setActiveFooterDialog('privacy')}>
            Privacy Policy
          </button>
          <button type="button" className="footer-link-btn" onClick={() => setActiveFooterDialog('legal')}>
            Legal Statement
          </button>
        </div>
        <p>© 2026 Classic Stone Design & Build · Arlington, Virginia · All Rights Reserved</p>
      </footer>

      {activeFooterDialog && (
        <div className="footer-policy-overlay" onClick={() => setActiveFooterDialog(null)}>
          <div className="footer-policy-modal" onClick={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="footer-dialog-title">
            <button type="button" className="footer-policy-close" onClick={() => setActiveFooterDialog(null)} aria-label={`Close ${dialogContent.kicker.toLowerCase()}`}>
              ✕
            </button>
            <p className="footer-policy-kicker">{dialogContent.kicker}</p>
            <h2 id="footer-dialog-title" className="footer-policy-title">{dialogContent.title}</h2>
            <p className="footer-policy-intro">{dialogContent.intro}</p>

            <div className="footer-policy-content">
              {dialogContent.sections.map(section => (
                <section key={section.title || section.paragraphs[0]} className="footer-policy-section">
                  {section.title && <h3>{section.title}</h3>}
                  {section.paragraphs.map(paragraph => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items && (
                    <ul>
                      {section.items.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <p className="footer-policy-date">{dialogContent.footerNote}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
