import nodemailer from 'nodemailer'

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'projectType', 'vision']

export class ContactError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ContactError'
    this.status = status
  }
}

export function validateContactForm(form) {
  const missingField = REQUIRED_FIELDS.find(field => !String(form[field] || '').trim())

  if (missingField) {
    throw new ContactError(400, `${missingField} is required.`)
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    throw new ContactError(400, 'A valid email address is required.')
  }

  if (!/^\+?[\d\s().-]{7,}$/.test(form.phone)) {
    throw new ContactError(400, 'A valid phone number is required.')
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildTransport(env) {
  const port = Number(env.SMTP_PORT || 465)

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  })
}

export async function sendContactEmail(form, env = process.env) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new ContactError(500, 'Contact form email is not configured on the server.')
  }

  validateContactForm(form)

  const transporter = buildTransport(env)
  const recipient = env.CONTACT_FORM_TO_EMAIL || 'Classicstoneva@gmail.com'
  const fromAddress = env.CONTACT_FORM_FROM_EMAIL || env.SMTP_FROM || env.SMTP_USER

  try {
    await transporter.sendMail({
      from: `Classic Stone Website <${fromAddress}>`,
      to: recipient,
      replyTo: form.email,
      subject: `Classic Stone inquiry from ${form.firstName} ${form.lastName}`,
      text: [
        `First Name: ${form.firstName}`,
        `Last Name: ${form.lastName}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone}`,
        `Project Type: ${form.projectType}`,
        '',
        'Project Details:',
        form.vision,
      ].join('\n'),
      html: `
        <h2>New Classic Stone Inquiry</h2>
        <p><strong>First Name:</strong> ${escapeHtml(form.firstName)}</p>
        <p><strong>Last Name:</strong> ${escapeHtml(form.lastName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(form.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(form.phone)}</p>
        <p><strong>Project Type:</strong> ${escapeHtml(form.projectType)}</p>
        <p><strong>Project Details:</strong></p>
        <p>${escapeHtml(form.vision).replace(/\n/g, '<br />')}</p>
      `,
    })
  } catch {
    throw new ContactError(502, 'The server could not send your message.')
  }
}