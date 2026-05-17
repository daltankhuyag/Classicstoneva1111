import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const homeHref = (hash) => pathname === '/' ? hash : `/${hash}`
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={`navbar-wrap ${scrolled ? 'scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
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
          <button
            type="button"
            className="navbar-menu-btn"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen(open => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <ul id="primary-navigation" className={`navbar-links${menuOpen ? ' mobile-open' : ''}`}>
            <li><a href={homeHref('#about')} onClick={closeMenu}>About</a></li>
            <li><a href={homeHref('#services')} onClick={closeMenu}>Services</a></li>
            <li>
              <Link
                to="/floor-plans"
                className={pathname === '/floor-plans' ? 'nav-active' : ''}
                onClick={closeMenu}
              >
                Floor Plans
              </Link>
            </li>
            <li>
              <Link
                to="/remodeling"
                className={pathname === '/remodeling' ? 'nav-active' : ''}
                onClick={closeMenu}
              >
                Remodeling
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={pathname === '/gallery' ? 'nav-active' : ''}
                onClick={closeMenu}
              >
                Gallery
              </Link>
            </li>
            <li><a href={homeHref('#contact')} onClick={closeMenu}>Contact</a></li>
            <li>
              <Link
                to="/schedule"
                className={`sc-nav-btn${pathname === '/schedule' ? ' nav-active' : ''}`}
                onClick={closeMenu}
              >
                Book a Visit
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
