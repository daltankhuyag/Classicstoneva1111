const ADDONS = [
  { id: 'seo', icon: '🔍', name: 'SEO Package', desc: 'Keyword research, meta tags, sitemap & Google Search Console setup.', price: 499 },
  { id: 'ecommerce', icon: '🛒', name: 'E-Commerce', desc: 'Full online store with product pages, cart, and Stripe checkout.', price: 1499 },
  { id: 'blog', icon: '✍️', name: 'Blog / CMS', desc: 'Content management system so you can publish posts without code.', price: 399 },
  { id: 'maintenance', icon: '🛠️', name: 'Maintenance Plan', desc: '12 months of updates, security patches, and monthly backups.', price: 799 },
  { id: 'analytics', icon: '📊', name: 'Analytics Dashboard', desc: 'Custom reporting dashboard with traffic, leads, and conversion tracking.', price: 349 },
  { id: 'multilang', icon: '🌍', name: 'Multi-Language', desc: 'Full site translation support for up to 5 languages.', price: 599 },
]

export default function Step2Addons({ selected, onToggle, total, onBack, onNext }) {
  return (
    <div className="builder-card">
      <div className="builder-card-title">Enhance With Add-ons</div>
      <div className="builder-card-sub">Optional extras to supercharge your website. Mix and match freely.</div>

      <div className="addon-grid">
        {ADDONS.map((addon) => {
          const isSelected = selected.some((a) => a.id === addon.id)
          return (
            <div
              key={addon.id}
              className={`addon-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggle(addon)}
            >
              <div className="addon-icon">{addon.icon}</div>
              <div className="addon-info">
                <div className="addon-name">{addon.name}</div>
                <div className="addon-desc">{addon.desc}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <div className="addon-price">+${addon.price}</div>
                <div className="addon-checkbox">{isSelected && '✓'}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="builder-nav" style={{ marginTop: 32 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div className="builder-nav-price">
            Total so far: <strong>${total.toLocaleString()}</strong>
          </div>
          <button className="btn btn-primary" onClick={onNext}>Next: Details →</button>
        </div>
      </div>
    </div>
  )
}
