// Regression tests for: nodemailer@8.0.7 upgrade
import test from 'node:test'
import assert from 'node:assert/strict'
import { buildTransport, escapeHtml } from './email.js'

test('email helpers escape html-sensitive characters', () => {
  assert.equal(escapeHtml('<stone & steel>'), '&lt;stone &amp; steel&gt;')
})

test('email helpers create a secure transport by default for port 465', () => {
  let capturedConfig = null
  const nodemailer = {
    createTransport(config) {
      capturedConfig = config
      return { ok: true }
    },
  }

  buildTransport(nodemailer, {
    SMTP_HOST: 'smtp.example.com',
    SMTP_PORT: '465',
    SMTP_USER: 'user',
    SMTP_PASS: 'pass',
  })

  assert.deepEqual(capturedConfig, {
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    auth: {
      user: 'user',
      pass: 'pass',
    },
  })
})