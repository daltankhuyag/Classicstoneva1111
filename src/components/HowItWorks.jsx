const services = [
  {
    title: 'Custom Home Design & Build',
    desc: 'We partner with top Virginia architects and designers to bring your vision to life — from concept sketches to the last coat of paint.',
  },
  {
    title: 'Stone & Natural Material Work',
    desc: 'Our signature stonework — sourced from Virginia quarries — adds timeless character to facades, fireplaces, and foundations.',
  },
  {
    title: 'Site Planning & Land Prep',
    desc: 'We handle grading, drainage, and site assessment so your home sits perfectly on its land, built to last through every season.',
  },
  {
    title: 'Sustainable Building Practices',
    desc: 'Energy-efficient design, locally sourced materials, and responsible construction — because a good home should be kind to the land it sits on.',
  },
  {
    title: 'Interior Finish & Millwork',
    desc: 'From custom cabinetry to wide-plank hardwood floors, our interior teams bring warmth and character to every room.',
  },
  {
    title: 'Full-Service Project Management',
    desc: 'One point of contact, start to finish. We coordinate every subcontractor, permit, and inspection so you never have to.',
  },
]

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services-header">
          <p className="section-label">What We Offer</p>
          <h2 className="section-title">Every home, built from the ground up.</h2>
          <div className="divider" />
        </div>
        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" key={s.title}>
              <span className="service-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
