import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
  // Aviemore (Achievemore folder)
  { url: "/Achievemore/WhatsApp Image 2026-06-06 at 08.30.51.jpeg", title: "Aviemore - Living Space" },
  { url: "/Achievemore/WhatsApp Image 2026-06-06 at 08.30.52.jpeg", title: "Aviemore - Bedroom" },
  { url: "/Achievemore/WhatsApp Image 2026-06-06 at 08.30.52 (1).jpeg", title: "Aviemore - Details" },
  { url: "/Achievemore/WhatsApp Image 2026-06-06 at 08.30.52 (2).jpeg", title: "Aviemore - Kitchen" },
  { url: "/Achievemore/WhatsApp Image 2026-06-06 at 08.30.53.jpeg", title: "Aviemore - Flagship" },
  
  // Clairwood
  { url: "/Clairwood/WhatsApp Image 2026-06-06 at 08.32.07.jpeg", title: "Clairwood - Entrance" },
  { url: "/Clairwood/WhatsApp Image 2026-06-06 at 08.32.07 (1).jpeg", title: "Clairwood - Bedroom" },
  { url: "/Clairwood/WhatsApp Image 2026-06-06 at 08.32.07 (2).jpeg", title: "Clairwood - Interior" },
  { url: "/Clairwood/WhatsApp Image 2026-06-06 at 08.32.08.jpeg", title: "Clairwood - Comfort" },
  
  // Peterhouse
  { url: "/Peterhouse/WhatsApp Image 2026-06-06 at 08.33.10.jpeg", title: "Peterhouse - Spacious" },
  { url: "/Peterhouse/WhatsApp Image 2026-06-06 at 08.33.10 (1).jpeg", title: "Peterhouse - Bedroom" },
  { url: "/Peterhouse/WhatsApp Image 2026-06-06 at 08.33.10 (2).jpeg", title: "Peterhouse - Layout" },
  { url: "/Peterhouse/WhatsApp Image 2026-06-06 at 08.33.11.jpeg", title: "Peterhouse - Modern" }
]

const Lookbook = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = Math.ceil(images.length / 2)

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages)
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)

  return (
    <section id="gallery" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading text-primary mb-4">The Melina Lookbook</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-4"></div>
          <p className="text-text-secondary italic">Step inside our properties</p>
        </div>

        <div className="relative max-w-5xl mx-auto h-[400px] md:h-[650px] perspective-1000">
          <div className="flex w-full h-full gap-2 md:gap-4">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`page-${currentPage}`}
                className="flex w-full h-full gap-2 md:gap-4"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Left Page */}
                <div className="w-1/2 h-full bg-surface rounded-l-2xl overflow-hidden shadow-2xl relative border-r border-black/10">
                  <img 
                    src={images[currentPage * 2].url} 
                    alt="Gallery" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Right Page */}
                <div className="w-1/2 h-full bg-surface rounded-r-2xl overflow-hidden shadow-2xl relative">
                  <img 
                    src={(images[currentPage * 2 + 1] || images[0]).url} 
                    alt="Gallery" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <button 
            onClick={prevPage}
            type="button"
            className="absolute left-[-20px] md:left-[-60px] top-1/2 -translate-y-1/2 w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all z-20 active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextPage}
            type="button"
            className="absolute right-[-20px] md:right-[-60px] top-1/2 -translate-y-1/2 w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all z-20 active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Page Indicator */}
          <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex items-center gap-3">
             {Array.from({ length: totalPages }).map((_, i) => (
               <button 
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${currentPage === i ? "bg-primary w-8" : "bg-primary/20 hover:bg-primary/40"}`}
               />
             ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Lookbook
