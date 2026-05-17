import { SEO_PAGES } from '../src/data/seo.js'

function trimTrailingSlash(value) {
  return value.replace(/\/$/, '')
}

export function getRequestSiteUrl(req) {
  const forwardedProto = req.headers['x-forwarded-proto']
  const forwardedHost = req.headers['x-forwarded-host']
  const host = forwardedHost || req.headers.host
  const protocol = forwardedProto || (host && host.includes('localhost') ? 'http' : 'https')

  if (!host) {
    return ''
  }

  return trimTrailingSlash(`${protocol}://${host}`)
}

export function renderSitemapXml(siteUrl, lastModified = new Date().toISOString()) {
  const urls = SEO_PAGES.map(page => {
    const absoluteUrl = `${siteUrl}${page.path === '/' ? '/' : page.path}`

    return [
      '  <url>',
      `    <loc>${absoluteUrl}</loc>`,
      `    <lastmod>${lastModified}</lastmod>`,
      `    <changefreq>${page.changeFrequency}</changefreq>`,
      `    <priority>${page.priority}</priority>`,
      '  </url>',
    ].join('\n')
  }).join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].join('\n')
}

export function renderRobotsTxt(siteUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n')
}