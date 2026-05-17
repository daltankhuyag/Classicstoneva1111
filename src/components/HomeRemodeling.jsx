const SERVICES = [
  {
    icon: '🍳',
    title: 'Kitchen Renovation',
    desc: 'From cabinet replacements to full gut-and-rebuild, we transform kitchens into the heart of your home — functional, beautiful, and built to last.',
    tags: ['Custom cabinetry', 'Quartz countertops', 'Island additions'],
  },
  {
    icon: '🛁',
    title: 'Bathroom Remodel',
    desc: 'Spa-quality finishes, walk-in showers, freestanding tubs, and heated floors — we turn dated bathrooms into daily retreats.',
    tags: ['Tile work', 'Fixtures & lighting', 'Walk-in shower'],
  },
  {
    icon: '🏠',
    title: 'Home Additions',
    desc: 'Need more space? We design and build seamless additions — master suites, sunrooms, in-law apartments — that look like they were always there.',
    tags: ['Master suite', 'Sunroom', 'In-law suite'],
  },
  {
    icon: '🪟',
    title: 'Basement Finishing',
    desc: 'Turn unused square footage into a media room, home gym, guest suite, or playroom. We handle waterproofing, framing, and every finish.',
    tags: ['Waterproofing', 'Egress windows', 'Full bath add-on'],
  },
  {
    icon: '🛏',
    title: 'Master Suite Upgrade',
    desc: 'Reclaim your space. We expand, reconfigure, and elevate primary bedrooms and baths with walk-in closets, vaulted ceilings, and luxury finishes.',
    tags: ['Walk-in closet', 'Vaulted ceiling', 'En-suite bath'],
  },
  {
    icon: '🪚',
    title: 'Custom Trim Service',
    desc: 'Add polished detail throughout your home with custom trim work, crown molding, wainscoting, coffered ceilings, and built-in finish carpentry tailored to your space.',
    tags: ['Crown molding', 'Wainscoting', 'Finish carpentry'],
  },
]

const PROCESS = [
  {
    step: '01',
    title: 'Consultation & Vision',
    desc: 'We listen first. A dedicated project consultant meets with you to understand your goals, lifestyle, and budget before any plans are drawn.',
  },
  {
    step: '02',
    title: 'Design & Material Selection',
    desc: 'Our design team creates detailed 3D layouts and guides you through material selections — countertops, tile, fixtures, finishes — at our Virginia showroom.',
  },
  {
    step: '03',
    title: 'Permits & Site Prep',
    desc: 'We handle every permit, HOA submission, and inspection scheduling. Your home is protected and prepped before a single tool is picked up.',
  },
  {
    step: '04',
    title: 'Build & Transform',
    desc: 'Our craftsmen work on a structured schedule with daily updates. You\'re never left wondering what\'s happening in your home.',
  },
  {
    step: '05',
    title: 'Final Walkthrough & Handover',
    desc: 'We walk every square foot with you before signing off. Punch list items are resolved within 48 hours. You move in with confidence.',
  },
]

export default function HomeRemodeling() {
  return (
    <div className="hr-wrap">

      {/* ── Service cards ── */}
      <section className="hr-section">
        <div className="container">
          <div className="hr-intro">
            <div className="hr-intro-text">
              <p className="section-label">Remodeling Services</p>
              <h2 className="section-title">Your home, elevated.</h2>
              <div className="divider" />
              <p className="hr-intro-body">
                Classic Stone brings the same craftsmanship behind our custom builds to every
                remodeling project — whether it's a single room refresh or a whole-home
                transformation. We work around your life, not the other way around.
              </p>
            </div>
          </div>

          <div className="hr-grid">
            {SERVICES.map(svc => (
              <div className="hr-card" key={svc.title}>
                <span className="hr-card-icon">{svc.icon}</span>
                <h3 className="hr-card-title">{svc.title}</h3>
                <p className="hr-card-desc">{svc.desc}</p>
                <div className="hr-card-tags">
                  {svc.tags.map(t => (
                    <span className="fp-tag" key={t}>{t}</span>
                  ))}
                </div>
                <div className="hr-card-footer">
                  <a href="#contact" className="hr-card-link">Get a quote ↗</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="hr-process-section">
        <div className="container">
          <p className="section-label" style={{ color: 'var(--copper-light)' }}>How It Works</p>
          <h2 className="section-title" style={{ color: '#f5f2ee' }}>
            Our remodeling process.
          </h2>
          <div className="divider" />
          <div className="hr-process-list">
            {PROCESS.map((p, i) => (
              <div className="hr-process-item" key={p.step}>
                <div className="hr-process-step">{p.step}</div>
                <div className="hr-process-body">
                  <h4 className="hr-process-title">{p.title}</h4>
                  <p className="hr-process-desc">{p.desc}</p>
                </div>
                {i < PROCESS.length - 1 && <div className="hr-process-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hr-cta-section">
        <div className="container hr-cta-inner">
          <div>
            <h2 className="hr-cta-title">Ready to start your remodel?</h2>
            <p className="hr-cta-sub">
              Free on-site consultation · No obligation estimate · Virginia-licensed contractors
            </p>
          </div>
          <div className="hr-cta-actions">
            <a href="#contact" className="btn btn-fill">Schedule a Consultation</a>
            <a href="tel:+12022270788" className="btn">Call (202) 227-0788</a>
          </div>
        </div>
      </section>

    </div>
  )
}
