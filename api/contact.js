import { ContactError, sendContactEmail } from '../server/contact.js'

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { ok: false, error: 'Method not allowed.' })
  }

  try {
    await sendContactEmail(req.body || {}, process.env)
    return json(res, 200, { ok: true })
  } catch (error) {
    if (error instanceof ContactError) {
      return json(res, error.status, { ok: false, error: error.message })
    }

    return json(res, 500, { ok: false, error: 'The server could not send your message.' })
  }
}