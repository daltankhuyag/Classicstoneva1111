import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import CtaBanner from './components/CtaBanner'
import StonePartners from './components/StonePartners'
import Footer from './components/Footer'
import FloorPlansPage from './pages/FloorPlansPage'
import HomeRemodelingPage from './pages/HomeRemodelingPage'
import SchedulingPage from './pages/SchedulingPage'
import StoneGalleryPage from './pages/StoneGalleryPage'

function HomePage() {
  return (
    <>
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
        <Route path="/remodeling" element={<HomeRemodelingPage />} />
        <Route path="/schedule" element={<SchedulingPage />} />
        <Route path="/stone-gallery" element={<StoneGalleryPage />} />
      </Routes>
      <Footer />
    </>
  )
}
