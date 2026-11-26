import { useEffect, useRef } from 'react'

export default function AdUnit({ className = '' }) {
  const adRef = useRef(null)

  useEffect(() => {
    if (!adRef.current) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
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
