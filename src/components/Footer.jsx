export default function Footer() {
  return (
    <>
      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <p className="section-label">Get In Touch</p>
              <h2 className="section-title">Let's build something lasting.</h2>
              <div className="divider" />
              <p>
                Whether you have a plot of land and a dream, or just a few ideas scrawled on a
                napkin — we'd love to hear from you. Consultations are always free.
              </p>
              <div className="contact-detail">
                <span className="contact-detail-label">Phone</span>
                <span className="contact-detail-val">(202) 227-0788</span>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-label">Email</span>
                <span className="contact-detail-val">Classicstoneva@gmail.com</span>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-label">Location</span>
                <span className="contact-detail-val">
                  Serving Arlington,Fairfax of Virginia<br />Office: Arlington, VA
                </span>
              </div>
            </div>

            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="Jane" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Doe" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="jane@email.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="(540) 555-0000" />
                </div>
              </div>
              <div className="form-group">
                <label>Project Type</label>
                <select>
                  <option value="">Select one...</option>
                  <option>New Custom Home Build</option>
                  <option>Land + Build Package</option>
                  <option>Addition or Renovation</option>
                  <option>Stone &amp; Masonry Work</option>
                  <option>Just Exploring – Schedule a Call</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tell Us About Your Vision</label>
                <textarea placeholder="Share your ideas, location, timeline, or any questions..." />
              </div>
              <div>
                <button type="submit" className="btn btn-fill" style={{ cursor: 'pointer' }}>
                  Send My Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Classic Stone Custom Homes · Charlottesville, Virginia · All Rights Reserved</p>
      </footer>
    </>
  )
}
