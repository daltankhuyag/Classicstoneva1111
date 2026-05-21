import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { ContactError } from './server/email.js'
import { sendContactEmail } from './server/contact.js'
import { sendSubscribeEmail } from './server/subscribe.js'

function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function contactApiPlugin() {
  return {
    name: 'contact-api-dev',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')

      const handlePost = (path, sender, failureMessage) => {
        server.middlewares.use(path, async (req, res) => {
          if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST')
            return json(res, 405, { ok: false, error: 'Method not allowed.' })
          }

          const chunks = []

          req.on('data', chunk => chunks.push(chunk))
          req.on('end', async () => {
            try {
              const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}
              await sender(body, { ...process.env, ...env })
              return json(res, 200, { ok: true })
            } catch (error) {
              if (error instanceof SyntaxError) {
                return json(res, 400, { ok: false, error: 'Invalid request body.' })
              }

              if (error instanceof ContactError) {
                return json(res, error.status, { ok: false, error: error.message })
              }

              return json(res, 500, { ok: false, error: failureMessage })
            }
          })
        })
      }

      handlePost('/api/contact', sendContactEmail, 'The server could not send your message.')
      handlePost('/api/subscribe', sendSubscribeEmail, 'The server could not process the subscription.')
    },
  }
}

export default defineConfig({
  plugins: [react(), contactApiPlugin()],
})
