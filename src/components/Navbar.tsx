import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-primary shadow-lg" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className={cn(
          "text-3xl logo-font transition-colors duration-300",
          isScrolled ? "text-white" : "text-primary"
        )}>
          melina
        </div>

        {/* Desktop Menu */}
        <div className={cn(
          "hidden md:flex space-x-8 items-center font-medium",
          isScrolled ? "text-white/90" : "text-primary"
        )}>
          <a href="#" className="hover:text-accent transition-colors">Home</a>
          <a href="#apartments" className="hover:text-accent transition-colors">Apartments</a>
          <a href="#booking" className="hover:text-accent transition-colors">Book Now</a>
          <a href="#gallery" className="hover:text-accent transition-colors">Lookbook</a>
          <a 
            href="#booking" 
            className={cn(
              "px-6 py-2 rounded-full border transition-all",
              isScrolled 
                ? "border-accent text-accent hover:bg-accent hover:text-primary" 
                : "border-primary text-primary hover:bg-primary hover:text-white"
            )}
          >
            Check Availability
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? "text-white" : "text-primary"} />
          ) : (
            <Menu className={isScrolled ? "text-white" : "text-primary"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-primary text-white p-6 space-y-4 md:hidden animate-in slide-in-from-top">
          <a href="#" className="block py-2 border-b border-white/10" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="#apartments" className="block py-2 border-b border-white/10" onClick={() => setIsMobileMenuOpen(false)}>Apartments</a>
          <a href="#booking" className="block py-2 border-b border-white/10" onClick={() => setIsMobileMenuOpen(false)}>Book Now</a>
          <a href="#gallery" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Lookbook</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar
