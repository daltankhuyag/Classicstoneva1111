const PARTNERS = [
  {
    name: 'CAMBRIA',
    sub: 'American Quartz · Family Owned',
    note: 'Authorized Dealer',
    style: { fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.22em', fontWeight: 700 },
  },
  {
    name: 'SILESTONE',
    sub: 'Quartz Surfaces · Cosentino',
    note: 'Certified Installer',
    style: { fontFamily: "'Inter', sans-serif", letterSpacing: '0.18em', fontWeight: 800 },
  },
  {
    name: 'DEKTON',
    sub: 'Ultra-Compact Surface · Cosentino',
    note: 'Certified Installer',
    style: { fontFamily: "'Inter', sans-serif", letterSpacing: '0.28em', fontWeight: 900 },
  },
]

export default function StonePartners() {
  return (
    <section className="sp-section">
      <div className="container">
        <div className="sp-header">
          <span className="sp-label">Authorized Stone Partners</span>
          <span className="sp-tagline">
            We source exclusively from industry-leading suppliers — so every slab meets our quality standard.
          </span>
        </div>
        <div className="sp-grid">
          {PARTNERS.map((p, i) => (
            <div className="sp-card" key={p.name}>
              <div className="sp-logo" style={p.style}>{p.name}</div>
              <div className="sp-divider-v" />
              <div className="sp-meta">
                <span className="sp-sub">{p.sub}</span>
                <span className="sp-note">{p.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
