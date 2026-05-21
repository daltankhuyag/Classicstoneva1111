import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = 'G-D4KTP0GPCF'

export function trackAnalyticsEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', eventName, {
    ...params,
    send_to: GA_MEASUREMENT_ID,
  })
}

export default function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}${location.hash}`

    trackAnalyticsEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
    })
  }, [location.hash, location.pathname, location.search])

  return null
}
