const services = [
  {
    title: 'Home Design & Build',
    desc: 'We partner with Virginia architects and designers to bring your vision to life — from concept sketches to the last coat of paint.',
  },
  {
    title: 'Natural Stone & Natural Material Work',
    desc: 'Our signature stonework — sourced of all types of natural stone — adds timeless character to Kitchen countertops, fireplaces, and bathroom wall vertical application.',
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

const stoneServices = [
  {
    title: 'Architectural Stone',
    desc: 'Columns, sills, copings, and custom-cut pieces for interior and exterior applications. We work in natural stone including limestone, granite, and marble, as well as quality manufactured stone matched to your design and climate.',
  },
  {
    title: 'Fireplace Stone',
    desc: 'The fireplace is the heart of a room, and the right stone makes it the focal point. We design and build full surrounds, mantels, hearths, and floor-to-ceiling features in natural and manufactured stone, sized and finished to fit your space.',
  },
  {
    title: 'Fabrication',
    desc: 'Our shop cuts, shapes, and finishes stone to exact specifications. Custom profiles, edge work, and precision sizing mean your material arrives ready to install with no guesswork on site.',
  },
  {
    title: 'Installation',
    desc: 'Experienced masons handle every install, from veneer adhesion to structural setting. Proper substrate prep, weatherproofing, and clean joint work ensure your stone looks right and holds up for decades.',
  },
]

export default function Services() {
  return (
    <>
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
      <section className="services services-featured-section" aria-labelledby="stone-services-title">
        <div className="container">
          <div className="services-header">
            <p className="section-label">Stone Products & Services</p>
            <h2 className="section-title" id="stone-services-title">Specialized stone work for interiors and exteriors.</h2>
            <div className="divider" />
          </div>
          <div className="services-grid services-grid-featured">
            {stoneServices.map((s) => (
              <div className="service-card" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
