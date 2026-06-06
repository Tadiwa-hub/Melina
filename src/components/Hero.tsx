import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Navy Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2000")' }}
      >
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="logo-font text-3xl text-white mb-4 block">melina</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-heading text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Your Home in Harare
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl font-body text-white/75 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Self-catering apartments designed for comfort, independence and a genuine home away from home.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <a 
            href="#apartments" 
            className="px-8 py-4 bg-white text-primary font-semibold rounded-md hover:bg-accent hover:text-white transition-all duration-300"
          >
            View Apartments
          </a>
          <a 
            href="https://wa.me/263789907597" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-accent text-accent font-semibold rounded-md hover:bg-accent hover:text-white transition-all duration-300"
          >
            Book on WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <motion.div 
            className="w-1 h-2 bg-white rounded-full"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
