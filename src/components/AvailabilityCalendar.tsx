import { useState } from 'react'
import { cn } from '../lib/utils'

const properties = [
  { id: 'aviemore-apartment', name: 'Aviemore' },
  { id: 'clairewood-2bed', name: 'Clairewood' },
  { id: 'peterhouse-apartments', name: 'Peterhouse' }
]

const AvailabilityCalendar = () => {
  const [activeTab, setActiveTab] = useState(properties[0].id)

  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading text-primary mb-4">Live Availability</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {properties.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={cn(
                "px-6 py-2 rounded-full font-medium transition-all",
                activeTab === p.id 
                  ? "bg-primary text-white" 
                  : "bg-white text-primary hover:bg-primary/5"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span>Fully Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span>On Request</span>
          </div>
        </div>

        {/* Calendar Grid (Simplified Visual) */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
          <div className="grid grid-cols-7 gap-2">
            {/* Days of week */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-text-secondary py-2">
                {day}
              </div>
            ))}
            {/* Days placeholder */}
            {Array.from({ length: 31 }).map((_, i) => {
              const status = i % 7 === 0 ? 'red' : (i % 5 === 0 ? 'amber' : 'green')
              return (
                <div 
                  key={i} 
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-transform hover:scale-110 cursor-pointer",
                    status === 'green' && "bg-green-100 text-green-800",
                    status === 'red' && "bg-red-100 text-red-800",
                    status === 'amber' && "bg-amber-100 text-amber-800"
                  )}
                >
                  {i + 1}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AvailabilityCalendar
