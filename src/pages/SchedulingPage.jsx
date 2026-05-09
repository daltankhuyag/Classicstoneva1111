import Scheduler from '../components/Scheduler'

export default function SchedulingPage() {
  return (
    <>
      <div className="fp-page-banner">
        <div className="container">
          <p className="section-label">Classic Stone</p>
          <h1 className="fp-page-banner-title">Schedule a Consultation</h1>
          <p className="fp-page-banner-sub">
            Book a free consultation with our team — in-person at your site or virtually,
            on your schedule.
          </p>
        </div>
      </div>
      <section className="sc-page-section">
        <div className="container">
          <Scheduler />
        </div>
      </section>
    </>
  )
}
