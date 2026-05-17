import { getRequestSiteUrl, renderSitemapXml } from '../server/seo.js'

export default function handler(req, res) {
  const siteUrl = getRequestSiteUrl(req)

  if (!siteUrl) {
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Unable to determine site URL.')
    return
  }

  res.status(200)
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  res.end(renderSitemapXml(siteUrl))
}