import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import CtaBanner from './components/CtaBanner'
import StonePartners from './components/StonePartners'
import Footer from './components/Footer'
import Seo from './components/Seo'
import { getPageSeo } from './data/seo'
import FloorPlansPage from './pages/FloorPlansPage'
import GalleryPage from './pages/GalleryPage'
import HomeRemodelingPage from './pages/HomeRemodelingPage'
import SchedulingPage from './pages/SchedulingPage'
import StoneGalleryPage from './pages/StoneGalleryPage'

function HomePage() {
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
      <Hero />
      <Features />
      <HowItWorks />
      <CtaBanner />
      <StonePartners />
    </>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/floor-plans" element={<FloorPlansPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/remodeling" element={<HomeRemodelingPage />} />
        <Route path="/schedule" element={<SchedulingPage />} />
        <Route path="/stone-gallery" element={<StoneGalleryPage />} />
      </Routes>
      <Footer />
    </>
  )
}
