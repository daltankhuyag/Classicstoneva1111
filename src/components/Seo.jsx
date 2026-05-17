import { Helmet } from 'react-helmet-async'
import { DEFAULT_SEO, SITE_NAME } from '../data/seo'

function trimTrailingSlash(value) {
  return value.replace(/\/$/, '')
}

function buildSiteUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL

  if (configuredUrl) {
    return trimTrailingSlash(configuredUrl)
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimTrailingSlash(window.location.origin)
  }

  return ''
}

function buildAbsoluteUrl(siteUrl, value) {
  if (!value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  if (!siteUrl) {
    return value
  }

  return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`
}

export default function Seo({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  path = '/',
  image = DEFAULT_SEO.image,
  type = DEFAULT_SEO.type,
  noindex = false,
  structuredData,
}) {
  const siteUrl = buildSiteUrl()
  const canonicalUrl = buildAbsoluteUrl(siteUrl, path)
  const imageUrl = buildAbsoluteUrl(siteUrl, image)

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {structuredData ? <script type="application/ld+json">{JSON.stringify(structuredData)}</script> : null}
    </Helmet>
  )
}