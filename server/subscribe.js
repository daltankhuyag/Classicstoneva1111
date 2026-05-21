import { ContactError } from './email.js'

export function validateSubscribeForm(form) {
  const email = String(form.email || '').trim()

  if (!email) {
    throw new ContactError(400, 'Email is required.')
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new ContactError(400, 'A valid email address is required.')
  }

  if (!form.consent) {
    throw new ContactError(400, 'Consent is required to subscribe.')
  }
}

export async function sendSubscribeEmail(form, env = process.env) {
  validateSubscribeForm(form)

  if (!env.BREVO_API_KEY) {
    throw new ContactError(500, 'Brevo newsletter integration is not configured on the server.')
  }

  const listId = Number(env.BREVO_NEWSLETTER_LIST_ID || env.BREVO_LIST_ID)

  if (!Number.isInteger(listId) || listId <= 0) {
    throw new ContactError(500, 'Brevo newsletter list is not configured on the server.')
  }

  const firstName = String(form.firstName || '').trim()
  const source = String(form.source || 'website').trim()

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        attributes: {
          FIRSTNAME: firstName || undefined,
          SIGNUP_SOURCE: source,
        },
        listIds: [listId],
        updateEnabled: true,
      }),
    })

    if (!response.ok) {
      const raw = await response.text()
      throw new ContactError(502, raw || 'Brevo rejected the newsletter subscription.')
    }
  } catch {
    throw new ContactError(502, 'The server could not process the subscription.')
  }
}

