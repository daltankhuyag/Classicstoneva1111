const PARTNERS = [
  {
    name: 'CAMBRIA',
    sub: 'American Quartz · Family Owned',
    logo: '/Cambria Logo.png',
  },
  {
    name: 'SILESTONE',
    sub: 'Quartz Surfaces · Cosentino',
    logo: '/Silestone-Logo-Quartz.jpeg',
  },
  {
    name: 'DEKTON',
    sub: 'Ultra-Compact Surface · Cosentino',
    logo: '/Dekton logo.png',
  },
  {
    name: 'MSI',
    sub: 'Natural Stone · Quartz · Porcelain',
    logo: '/MSI logo.jpg',
  },
  {
    name: 'Caesarstone',
    sub: 'Premium Quartz Surfaces',
    logo: '/Caeserstone logo.png',
  },
]

export default function StonePartners() {
  const slidingPartners = [...PARTNERS, ...PARTNERS]

  return (
    <section className="sp-section">
      <div className="container">
        <div className="sp-header">
          <span className="sp-label">Stone Partners</span>
          <h2 className="sp-title">Trusted stone brands we fabricate and install.</h2>
          <span className="sp-tagline">
            We source exclusively from industry-leading suppliers — so every slab meets our quality standard.
          </span>
        </div>
        <div className="sp-marquee" aria-label="Stone partner logos">
          <div className="sp-track">
            {slidingPartners.map((partner, index) => (
              <article className="sp-card" key={`${partner.name}-${index}`} aria-hidden={index >= PARTNERS.length}>
                <div className="sp-logo-wrap">
                  <img className="sp-logo" src={partner.logo} alt={`${partner.name} logo`} loading="lazy" />
                </div>
                <div className="sp-meta">
                  <span className="sp-sub">{partner.sub}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
