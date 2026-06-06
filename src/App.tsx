import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyMelina from './components/WhyMelina'
import Apartments from './components/Apartments'
import Lookbook from './components/Lookbook'
import BookingForm from './components/BookingForm'
import Footer from './components/Footer'
import AdminPortal from './admin/AdminPortal'

const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <WhyMelina />
      <Apartments />
      <Lookbook />
      <BookingForm />
      <Footer />
    </main>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </Router>
  )
}

export default App
