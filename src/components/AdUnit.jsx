import { useEffect, useRef } from 'react'

export default function AdUnit({ className = '' }) {
  const adRef = useRef(null)
  const hasRequestedAdRef = useRef(false)

  useEffect(() => {
    if (!adRef.current || hasRequestedAdRef.current) return

    hasRequestedAdRef.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      hasRequestedAdRef.current = false
      console.warn('AdSense could not initialize.', error)
    }
  }, [])

  return (
    <div className={`ad-unit ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2981830560198599"
        data-ad-slot="8221078164"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
