const Footer = () => {
  return (
    <footer className="bg-primary text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <div className="text-4xl logo-font">melina</div>
          <p className="text-white/70 max-w-xs">
            Curated Apartments for Every Stay. 
            Designed for comfort, independence and a genuine home away from home.
          </p>
        </div>

        {/* Properties */}
        <div>
          <h4 className="text-lg font-heading mb-6 text-accent">Our Properties</h4>
          <ul className="space-y-4 text-white/70">
            <li className="flex justify-between items-center">
              <span>Aviemore Apartment</span>
              <span className="text-white font-medium">$175</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Clairewood 2-Bed</span>
              <span className="text-white font-medium">$80</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Peterhouse Apartments</span>
              <span className="text-white font-medium">$120</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-heading mb-6 text-accent">Contact Us</h4>
          <ul className="space-y-4 text-white/70">
            <li>WhatsApp: +263 78 990 7597</li>
            <li>Harare, Zimbabwe</li>
            <li>
              <a 
                href="https://wa.me/263789907597" 
                className="inline-block mt-4 px-6 py-2 border border-white/20 rounded hover:bg-white hover:text-primary transition-colors"
              >
                Send Message
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
        <p>&copy; {new Date().getFullYear()} Melina Apartments. All rights reserved.</p>
        <p>Site by <span className="text-white/60">Tadiwa</span></p>
      </div>
    </footer>
  )
}

export default Footer
