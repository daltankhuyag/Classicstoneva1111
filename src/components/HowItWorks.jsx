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

const HOME_INSPIRATION_IMAGES = [
  {
    title: 'Earthbound',
    image: 'https://images.ctfassets.net/79jq1weass0y/OWdyV3oyj2XWjm5nBY9th/a918d0484709768495cf694086a09550/Luna__I__Truffle_view_1_Final.jpg',
  },
  {
    title: 'Hermitage Kitchen',
    image: '/Inspiration Gallery/hermitage-kitchen-alex-lukey-soda-pop-design-001-25_IG-1240x1240.avif',
  },
  {
    title: 'Dark Side of Warm',
    image: 'https://images.ctfassets.net/79jq1weass0y/2Fk9yMu7CZOgQ6MDxkCvDL/a86f45ba42eee3ee4274795ac0ff39dc/Luxe_Canyon_Oak_Kitchen_v5.2.png',
  },
  {
    title: 'Brittanicca Living Room',
    image: '/Inspiration Gallery/brittanicca-living-room-henke-dpdsm-cs16-004-17_IG-1240x1240.avif',
  },
  {
    title: 'Golden Hour All Day',
    image: 'https://images.ctfassets.net/79jq1weass0y/1M1Fj0vKW4KgSYW7Qb0jkQ/0cea068fd3753b4f19981a3afddeef87/Echo__I__Timber_Dove_and_Indigo_v2.jpg',
  },
  {
    title: 'Everleigh Living Room',
    image: '/Inspiration Gallery/everleigh-living-room-design-001-24_IG-1240x1240.avif',
  },
  {
    title: 'The Art of Illumination',
    image: 'https://images.ctfassets.net/79jq1weass0y/IJKPlj7LOgqQQpZcHQl4H/173113cdbca12576543dd5035830266f/Illume__I__Tuscany__I__Matte_Cashmere_View_1.jpg',
  },
  {
    title: 'Inverness Bristol Bay Kitchen',
    image: '/Inspiration Gallery/inverness-bristol-bay-kitchen-modern-001-23_IG-1240x1240.avif',
  },
  {
    title: 'The Peak of Modernity',
    image: 'https://images.ctfassets.net/79jq1weass0y/5QFwmaZhYPWR36gLlbH6o/e291c2e8de7281dfeaa2e1a8952a685e/Allure__I__Luxe__I__Canyon_Oak_-_view_2.png',
  },
  {
    title: 'Inverness Bristol Bay Bathroom',
    image: '/Inspiration Gallery/inverness-bristol-bay-bathroom-transitional-001-23_IG-1240x1240.avif',
  },
  {
    title: 'The Bright Standards',
    image: 'https://images.ctfassets.net/79jq1weass0y/6jnzauK762jQqwBIGLf6ST/2e631b58d1d9ef3274e4118ece5035cb/Kitchen3_Hallmark_Frost.jpg',
  },
  {
    title: 'Seacourt Kitchen',
    image: '/Inspiration Gallery/seacourt-kitchen-carter-dodd-001-24_IG-1240x1240.avif',
  },
  {
    title: 'The Art of Fusion',
    image: 'https://images.ctfassets.net/79jq1weass0y/6155hP4SnwyV61inGEINGM/29f1f5aef2e3e7d759eba1124c5f293f/Allure__I__Fusion__I__Timber.png',
  },
  {
    title: 'Ivybridge Kitchen',
    image: '/Inspiration Gallery/ivybridge-kitchen-dodd-001-24.avif',
  },
  {
    title: 'Midnight Muse',
    image: 'https://images.ctfassets.net/79jq1weass0y/5pXI2NEeV0cphvFZFrF01L/9d38edc6e5d5c5f154eda9c49c039eb5/Allure__I__Luna__I__Indigo_-_View_1.jpg',
  },
  {
    title: 'Inverness Frost Kitchen',
    image: '/Inspiration Gallery/inverness-frost-kitchen-struxture-004-24_IG-1240x1240.avif',
  },
  {
    title: 'A Universe of Contrast',
    image: 'https://images.ctfassets.net/79jq1weass0y/53w9s9fsttNQ3QnE6PT721/0fcbce09000c38c39dfc798cb3066c47/Allure_I_Galaxy_I_Frost___Forest_Green_-_View_2.jpg',
  },
  {
    title: 'Inverness Platinum Kitchen',
    image: '/Inspiration Gallery/inverness-platinum-kitchen-ethan-charles-public-311-design-002-24_IG-1240x1240.avif',
  },
  {
    title: 'Echoes of Elegance',
    image: 'https://images.ctfassets.net/79jq1weass0y/51mJ1ngKO7oHvUf738GEgS/41e31c638b88c35b82632d83a39d2529/Echo__I__Timber___Dove_View_1.jpg',
  },
  {
    title: 'Hermitage Wentwood Bar',
    image: '/Inspiration Gallery/hermitage-wentwood-bar-kbd-karlisch-001-21_IG-1240x1240.avif',
  },
  {
    title: 'Delamere Living Room',
    image: '/Inspiration Gallery/delamere-living-room-la-light-photography-sophea-designs-006-24_IG-1240x1240.avif',
  },
  {
    title: 'Macbeth Bathroom',
    image: '/Inspiration Gallery/macbeth-bathroom-design-001-24_IG-1240x1240.avif',
  },
  {
    title: 'Southport Bathroom',
    image: '/Inspiration Gallery/southport-bathroom-gisele-parra-jennifer-kizzee-001-25_IG-1240x1240.avif',
  },
  {
    title: 'Portrush Matte Bathroom',
    image: '/Inspiration Gallery/portrush-matte-bathroom-dodd-004-25_IG-1240x1240.avif',
  },
]

const HOME_INSPIRATION_PREVIEW_COUNT = 12

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
      <section className="inspiration-gallery-section home-inspiration-section" aria-labelledby="home-inspiration-title">
        <div className="container">
          <div className="inspiration-gallery-head">
            <p className="section-label">Inspiration Gallery</p>
            <h2 className="section-title" id="home-inspiration-title">Design ideas for cabinetry, stone, and finished spaces.</h2>
            <div className="divider" />
            <p className="inspiration-gallery-intro">
              Browse a few of the looks clients reference most often when planning kitchens, bars,
              bathrooms, and full-room updates, with more cabinetry-focused inspiration shown
              directly here on the page.
            </p>
          </div>
          <div className="inspiration-gallery-grid">
            {HOME_INSPIRATION_IMAGES.slice(0, HOME_INSPIRATION_PREVIEW_COUNT).map(item => (
              <figure key={item.image} className="inspiration-gallery-card">
                <img src={item.image} alt={item.title} className="inspiration-gallery-image" loading="lazy" />
                <figcaption className="inspiration-gallery-caption">{item.title}</figcaption>
              </figure>
            ))}
          </div>
          <div className="home-inspiration-actions">
            <a href="/gallery" className="btn btn-fill">View Full Inspiration Gallery</a>
          </div>
        </div>
      </section>
    </>
  )
}
