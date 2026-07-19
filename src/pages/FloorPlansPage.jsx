import Seo from '../components/Seo'
import { getPageSeo } from '../data/seo'
import FloorPlans from '../components/FloorPlans'

export default function FloorPlansPage() {
  const pageSeo = getPageSeo('/floor-plans')

  return (
    <>
      <Seo title={pageSeo.title} description={pageSeo.description} path={pageSeo.path} />
      <div className="fp-page-banner">
        <div className="container">
          <p className="section-label">Classic Stone</p>
          <h1 className="fp-page-banner-title">Floor Plans &amp; Designs</h1>
          <p className="fp-page-banner-sub">
            Every home begins with the right plan. Browse our Virginia-built designs,
            each crafted for the way families actually live.
          </p>
        </div>
      </div>
      <FloorPlans />
    </>
  )
}
