import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import StoneGallery from '../components/StoneGallery'

export default function StoneGalleryPage() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    const element = document.querySelector(location.hash)

    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  }, [location.hash])

  return (
    <>
      <div className="fp-page-banner">
        <div className="container">
          <h1 className="fp-page-banner-title">Stone Gallery</h1>
          <p className="fp-page-banner-sub">
            Browse recent stonework across kitchens, baths, fireplaces, accent walls,
            and architectural details completed by Classic Stone craftsmen in Virginia.
          </p>
        </div>
      </div>
      <StoneGallery />
    </>
  )
}