import { motion } from 'framer-motion'
import { Utensils, MapPin, DollarSign, Smartphone } from 'lucide-react'

const benefits = [
  {
    icon: <Utensils className="w-8 h-8 text-primary" />,
    title: "Full Self-Catering",
    description: "Cook your own meals and live on your own schedule with fully equipped kitchens."
  },
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: "Prime Locations",
    description: "Strategically located across Harare's best suburbs for safety and convenience."
  },
  {
    icon: <DollarSign className="w-8 h-8 text-primary" />,
    title: "Better Than Hotels",
    description: "More space, more privacy and better value per night for families and groups."
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: "Book Direct",
    description: "No commission platforms. Direct WhatsApp booking means better rates for you."
  }
]

const WhyMelina = () => {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-6">{benefit.icon}</div>
              <h3 className="text-xl font-heading text-primary mb-3">{benefit.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyMelina
