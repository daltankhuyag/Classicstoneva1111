import Seo from '../components/Seo'
import { getPageSeo } from '../data/seo'
import HomeRemodeling from '../components/HomeRemodeling'

export default function HomeRemodelingPage() {
  const pageSeo = getPageSeo('/remodeling')

  return (
    <>
      <Seo title={pageSeo.title} description={pageSeo.description} path={pageSeo.path} />
      <div className="fp-page-banner">
        <div className="container">
          <p className="section-label">Classic Stone</p>
          <h1 className="fp-page-banner-title">Home Remodeling</h1>
          <p className="fp-page-banner-sub">
            Thoughtful renovations rooted in Virginia craftsmanship. From a single room to
            a whole-home transformation — done right, on time, and built to last.
          </p>
        </div>
      </div>
      <HomeRemodeling />
    </>
  )
}
