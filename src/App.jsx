import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import CtaBanner from './components/CtaBanner'
import { trackAnalyticsEvent } from './components/AnalyticsTracker'
import NewsletterPopup from './components/NewsletterPopup'
import StonePartners from './components/StonePartners'
import Footer from './components/Footer'
import Seo from './components/Seo'
import { getPageSeo } from './data/seo'
import FloorPlansPage from './pages/FloorPlansPage'
import FinancialForecastingPage from './pages/FinancialForecastingPage'
import GalleryPage from './pages/GalleryPage'
import HomeRemodelingPage from './pages/HomeRemodelingPage'
import SchedulingPage from './pages/SchedulingPage'
import StoneGalleryPage from './pages/StoneGalleryPage'

const NEWSLETTER_DISMISS_KEY = 'classicstone.newsletter.dismissed'
const NEWSLETTER_AUTO_DELAY_MS = 12000

function HomePage({ onOpenNewsletter }) {
  const homeSeo = getPageSeo('/')

  return (
    <>
      <Seo
        title={homeSeo.title}
        description={homeSeo.description}
        path={homeSeo.path}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'HomeAndConstructionBusiness',
          name: 'Classic Stone',
          image: '/HERO_IMAGE.png',
          email: 'classicstoneva@gmail.com',
          areaServed: 'Virginia',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Arlington',
            addressRegion: 'VA',
            addressCountry: 'US',
          },
        }}
      />
      <Hero onOpenNewsletter={onOpenNewsletter} />
      <Features />
      <HowItWorks />
      <CtaBanner onOpenNewsletter={onOpenNewsletter} />
      <StonePartners />
    </>
  )
}

export default function App() {
  const location = useLocation()
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)
  const [newsletterSource, setNewsletterSource] = useState('website')
  const [newsletterTriggerType, setNewsletterTriggerType] = useState('manual')

  useEffect(() => {
    if (typeof window === 'undefined' || location.pathname !== '/') {
      return undefined
    }

    if (window.localStorage.getItem(NEWSLETTER_DISMISS_KEY)) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      openNewsletter('home-timed', { triggerType: 'timed' })
    }, NEWSLETTER_AUTO_DELAY_MS)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [location.pathname])

  useEffect(() => {
    if (!isNewsletterOpen) {
      return
    }

    trackAnalyticsEvent('newsletter_popup_open', {
      source: newsletterSource,
      trigger_type: newsletterTriggerType,
    })
  }, [isNewsletterOpen, newsletterSource, newsletterTriggerType])

  const persistNewsletterDismissal = value => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(NEWSLETTER_DISMISS_KEY, value)
  }

  const openNewsletter = (source, options = {}) => {
    setNewsletterSource(source || 'website')
    setNewsletterTriggerType(options.triggerType || 'manual')
    setIsNewsletterOpen(true)

    if (source === 'hero' || source === 'portfolio-cta') {
      trackAnalyticsEvent('newsletter_trigger_click', {
        source,
      })
    }
  }

  const closeNewsletter = reason => {
    if (reason === 'dismissed') {
      persistNewsletterDismissal('dismissed')
    }

    setIsNewsletterOpen(false)
  }

  const handleNewsletterSuccess = () => {
    persistNewsletterDismissal('subscribed')
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage onOpenNewsletter={openNewsletter} />} />
        <Route path="/floor-plans" element={<FloorPlansPage />} />
        <Route path="/financial-forecasting" element={<FinancialForecastingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/remodeling" element={<HomeRemodelingPage />} />
        <Route path="/schedule" element={<SchedulingPage />} />
        <Route path="/stone-gallery" element={<StoneGalleryPage />} />
      </Routes>
      <Footer />
      <NewsletterPopup
        isOpen={isNewsletterOpen}
        onClose={closeNewsletter}
        onSuccess={handleNewsletterSuccess}
        source={newsletterSource}
      />
    </>
  )
}
