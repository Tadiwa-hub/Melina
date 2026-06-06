import { motion } from 'framer-motion'
import { cn, formatPrice } from '../lib/utils'
import { MapPin } from 'lucide-react'

const properties = [
  {
    id: "aviemore-apartment",
    name: "Aviemore Apartment",
    label: "SELF CATERING",
    price: 175,
    desc: "A spacious self-catering 3 bedroom apartment with all the comforts of home for families and groups.",
    capacity: 6,
    isFullWidth: true,
    images: [
      "/Achievemore/WhatsApp Image 2026-06-06 at 08.30.51.jpeg",
      "/Achievemore/WhatsApp Image 2026-06-06 at 08.30.52 (1).jpeg",
      "/Achievemore/WhatsApp Image 2026-06-06 at 08.30.52 (2).jpeg"
    ],
    features: ["3 Bedrooms", "Sleeps 6", "Self-Catering"]
  },
  {
    id: "clairewood-2bed",
    name: "Clairewood 2-Bed",
    label: "SELF CATERING",
    price: 80,
    desc: "A comfortable self-catering 2 bedroom apartment. Located at 14 Ceres Road, Avondale, Flat 6.",
    capacity: 4,
    address: "14 Ceres Road, Avondale",
    images: [
      "/Clairwood/WhatsApp Image 2026-06-06 at 08.32.07.jpeg",
      "/Clairwood/WhatsApp Image 2026-06-06 at 08.32.07 (1).jpeg",
      "/Clairwood/WhatsApp Image 2026-06-06 at 08.32.07 (2).jpeg"
    ],
    features: ["2 Bedrooms", "Sleeps 4", "Self-Catering"]
  },
  {
    id: "peterhouse-apartments",
    name: "Peterhouse Apartments",
    label: "SELF CATERING",
    price: 120,
    desc: "A well-appointed self-catering 3 bedroom apartment perfect for extended stays and family visits.",
    capacity: 6,
    images: [
      "/Peterhouse/WhatsApp Image 2026-06-06 at 08.33.10.jpeg",
      "/Peterhouse/WhatsApp Image 2026-06-06 at 08.33.10 (1).jpeg",
      "/Peterhouse/WhatsApp Image 2026-06-06 at 08.33.10 (2).jpeg"
    ],
    features: ["3 Bedrooms", "Sleeps 6", "Self-Catering"]
  }
]

const ApartmentCard = ({ property }: { property: typeof properties[0] }) => {
  return (
    <motion.div 
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-sm border border-border group",
        property.isFullWidth ? "md:col-span-2" : ""
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn(
        "flex flex-col",
        property.isFullWidth ? "md:flex-row" : ""
      )}>
        {/* Images Grid: 1 Big, 2 Small */}
        <div className={cn(
          "grid grid-cols-2 gap-1 p-1 bg-surface",
          property.isFullWidth ? "md:w-3/5" : "w-full"
        )}>
          <div className="col-span-2 h-[240px] md:h-[300px] overflow-hidden rounded-t-lg md:rounded-tl-lg md:rounded-tr-none">
            <img 
              src={property.images[0]} 
              alt={property.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="h-[120px] md:h-[150px] overflow-hidden rounded-bl-lg">
            <img 
              src={property.images[1]} 
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[120px] md:h-[150px] overflow-hidden rounded-br-lg md:rounded-br-none">
            <img 
              src={property.images[2]} 
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className={cn(
          "p-8 flex flex-col justify-between flex-1",
          property.isFullWidth ? "md:w-2/5" : ""
        )}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="bg-primary/10 text-primary text-[10px] tracking-widest font-bold py-1 px-3 rounded">
                {property.label}
              </span>
              {property.isFullWidth && (
                <span className="text-[10px] text-accent font-bold uppercase tracking-tighter">Flagship Property</span>
              )}
            </div>
            
            <h3 className="text-3xl font-heading text-primary mb-2">{property.name}</h3>
            
            {property.address && (
              <p className="flex items-center text-text-secondary text-xs mb-4">
                <MapPin className="w-3 h-3 mr-1" /> {property.address}
              </p>
            )}
            
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              {property.desc}
            </p>
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-secondary block uppercase tracking-wider font-bold">Per Night</span>
              <span className="text-3xl font-heading text-primary">{formatPrice(property.price)}</span>
            </div>
            <button 
              onClick={() => {
                window.location.hash = 'booking'
                window.dispatchEvent(new CustomEvent('select-property', { detail: property.id }))
              }}
              className="px-8 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-accent transition-all shadow-md active:scale-95"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Apartments = () => {
  return (
    <section id="apartments" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading text-primary mb-4">Our Apartments</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-text-secondary max-w-xl mx-auto italic">
            Three curated properties. One standard of excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {properties.map(property => (
            <ApartmentCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Apartments
