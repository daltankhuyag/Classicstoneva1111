const HERO_IMAGE = '/HERO_IMAGE.png'

export default function Hero() {
  return (
    <section className="hero" id="home">

      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />

      <div className="hero-overlay" />
      <div className="hero-texture" />
      <div className="hero-fade" />

      <div className="hero-content">
        <p className="hero-eyebrow">Virginia's Home Builder</p>
        <h1>
          Built with <em>Stone.</em><br />
          Crafted with Heart.
        </h1>
        <p className="hero-desc">
          Classic Stone builds homes that stand for generations, rooted in Virginia's natural beauty and timeless craftsmanship.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-fill">Get a Free Consultation</a>
          <a href="#portfolio" className="btn">View Our Work</a>
        </div>
      </div>

      <div className="scroll-hint">Explore</div>
    </section>
  )
}
