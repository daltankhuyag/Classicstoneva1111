import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { animate, stagger, svg } from 'animejs'
import PreviewFrame from './NavPreviews'

const MENU_ITEMS = [
  { id: 'about', num: '01', word: 'About', tag: 'Our story · in-house crew', kind: 'hash', hash: '#about', previewId: 'pv-about' },
  { id: 'services', num: '02', word: 'Services', tag: 'Cabinetry · countertops · design', kind: 'hash', hash: '#services', previewId: 'pv-services' },
  { id: 'floor-plans', num: '03', word: 'Floor Plans', tag: 'Custom Virginia home designs', kind: 'route', to: '/floor-plans', previewId: 'pv-floorplans' },
  { id: 'remodeling', num: '04', word: 'Remodeling', tag: 'Renovations & additions', kind: 'route', to: '/remodeling', previewId: 'pv-remodeling' },
  { id: 'gallery', num: '05', word: 'Gallery', tag: 'Finished project work', kind: 'route', to: '/gallery', previewId: 'pv-gallery' },
  { id: 'contact', num: '06', word: 'Contact', tag: 'Arlington · Fairfax, VA', kind: 'hash', hash: '#contact', previewId: 'pv-contact' },
  { id: 'schedule', num: '07', word: 'Book a Visit', tag: 'Free consultation', kind: 'route', to: '/schedule', previewId: 'pv-schedule' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePreview, setActivePreview] = useState(MENU_ITEMS[0].previewId)
  const { pathname } = useLocation()
  const activeItem = MENU_ITEMS.find(item => item.previewId === activePreview) ?? MENU_ITEMS[0]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const strokes = svg.createDrawable(`#${activePreview} .pv-draw`)

    animate(strokes, {
      draw: ['0 0', '0 1'],
      duration: reduced ? 1 : 900,
      delay: reduced ? 0 : stagger(60),
      ease: 'inOutQuad',
    })
  }, [menuOpen, activePreview])

  const homeHref = (hash) => pathname === '/' ? hash : `/${hash}`
  const closeMenu = () => setMenuOpen(false)

  const openMenu = () => {
    setActivePreview(MENU_ITEMS[0].previewId)
    setMenuOpen(true)
  }

  return (
    <>
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
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
            >
              <span className="navbar-menu-btn-label">
                <span className="lbl-open">Menu</span>
                <span className="lbl-close">Close</span>
              </span>
              <span className="navbar-menu-btn-icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <div
        id="primary-navigation"
        className={`nav-overlay${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav-overlay-grid">
          <nav aria-label="Main">
            <ul className="nav-menu-list">
              {MENU_ITEMS.map((item) => {
                const handleFocusPreview = () => setActivePreview(item.previewId)
                const linkContent = (
                  <>
                    <span className="nav-menu-num">{item.num}</span>
                    <span className="nav-menu-word">
                      <span className="nav-menu-word-inner">{item.word}</span>
                    </span>
                    <span className="nav-menu-tag">{item.tag}</span>
                  </>
                )

                return (
                  <li className="nav-menu-item" key={item.id}>
                    {item.kind === 'route' ? (
                      <Link
                        to={item.to}
                        className={`nav-menu-link${pathname === item.to ? ' nav-active' : ''}`}
                        onClick={closeMenu}
                        onMouseEnter={handleFocusPreview}
                        onFocus={handleFocusPreview}
                      >
                        {linkContent}
                      </Link>
                    ) : (
                      <a
                        href={homeHref(item.hash)}
                        className="nav-menu-link"
                        onClick={closeMenu}
                        onMouseEnter={handleFocusPreview}
                        onFocus={handleFocusPreview}
                      >
                        {linkContent}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="nav-preview-col" aria-hidden="true">
            <PreviewFrame activeId={activePreview} caption={`${activeItem.num} — ${activeItem.tag.toUpperCase()}`} />
          </div>
        </div>

        <div className="nav-overlay-meta">
          <span className="nav-meta-item"><a href="tel:+12022270788">Call the shop</a> · Arlington, VA</span>
          <span className="nav-meta-item"><a href="mailto:classicstoneva@gmail.com">Classicstoneva@gmail.com</a></span>
          <span className="nav-meta-item">Virginia-licensed contractors</span>
          <span className="nav-meta-item">© 2026 Classic Stone Design &amp; Build</span>
        </div>
      </div>
    </>
  )
}
