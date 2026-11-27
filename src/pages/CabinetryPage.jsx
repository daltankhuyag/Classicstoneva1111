import Seo from '../components/Seo'
import FabuwoodDoorStyles from '../components/FabuwoodDoorStyles'
import { getPageSeo } from '../data/seo'

export default function CabinetryPage() {
  const pageSeo = getPageSeo('/cabinetry')

  return (
    <>
      <Seo title={pageSeo.title} description={pageSeo.description} path={pageSeo.path} />
      <div className="fp-page-banner">
        <div className="container">
          <p className="section-label">Classic Stone Cabinetry</p>
          <h1 className="fp-page-banner-title">Cabinetry &amp; Door Profiles</h1>
          <p className="fp-page-banner-sub">
            Explore cabinet door styles, available finishes, and construction details.
            Open any profile to review its specifications and download a cabinet spec sheet.
          </p>
        </div>
      </div>
      <FabuwoodDoorStyles />
    </>
  )
}
