import StoneGallery from '../components/StoneGallery'

export default function StoneGalleryPage() {
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