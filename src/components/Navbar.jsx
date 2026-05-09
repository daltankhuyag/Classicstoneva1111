import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const homeHref = (hash) => pathname === '/' ? hash : `/${hash}`

  return (
    <div className={`navbar-wrap ${scrolled ? 'scrolled' : ''}`}>
      <div className="topbar">
        <div className="topbar-inner">
          <a className="topbar-item" href="tel:+12022270788">
            <span className="topbar-icon">📞</span>
            Phone: (202) 227-0788
          </a>
          <span className="topbar-sep">|</span>
          <a className="topbar-item" href="mailto:classicstoneva@gmail.com">
            <span className="topbar-icon">✉</span>
            Email: classicstoneva@gmail.com
          </a>
        </div>
      </div>

      <nav className="navbar-bar">
        <div className="navbar-inner">
          <a className="navbar-logo" href="/">
            Classic Stone
            <span>Design &amp; Build</span>
          </a>
          <ul className="navbar-links">
            <li><a href={homeHref('#about')}>About</a></li>
            <li><a href={homeHref('#services')}>Services</a></li>
            <li>
              <Link
                to="/floor-plans"
                className={pathname === '/floor-plans' ? 'nav-active' : ''}
              >
                Floor Plans
              </Link>
            </li>
            <li>
              <Link
                to="/remodeling"
                className={pathname === '/remodeling' ? 'nav-active' : ''}
              >
                Remodeling
              </Link>
            </li>
            <li><a href={homeHref('#portfolio')}>Portfolio</a></li>
            <li><a href={homeHref('#contact')}>Contact</a></li>
            <li>
              <Link to="/schedule" className={`sc-nav-btn${pathname === '/schedule' ? ' nav-active' : ''}`}>
                Book a Visit
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
