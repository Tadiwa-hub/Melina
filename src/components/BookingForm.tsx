import { useState, useEffect, type FormEvent, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, Users, Phone, User, MessageSquare, Send, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isBefore,
  startOfDay,
  isWithinInterval,
  parseISO
} from 'date-fns'

const properties = [
  { id: 'aviemore-apartment', name: 'Aviemore Apartment' },
  { id: 'clairewood-2bed', name: 'Clairewood 2-Bed' },
  { id: 'peterhouse-apartments', name: 'Peterhouse Apartments' }
]

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    property: properties[0].id,
    guests: 1,
    specialRequests: '',
    checkIn: null as Date | null,
    checkOut: null as Date | null
  })

  const [availability, setAvailability] = useState<{ booked: any[], blocked: any[] }>({ booked: [], blocked: [] })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Listen for property selection from apartment cards
  useEffect(() => {
    const handleSelectProperty = (e: any) => {
      setFormData(prev => ({ ...prev, property: e.detail }))
      // Smooth scroll to form
      const element = document.getElementById('booking')
      element?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('select-property', handleSelectProperty)
    return () => window.removeEventListener('select-property', handleSelectProperty)
  }, [])

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch availability when property changes
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`/api/availability?property_id=${formData.property}`)
        if (res.ok) {
          const data = await res.json()
          setAvailability(data)
        }
      } catch (err) {
        console.error('Failed to fetch availability', err)
      }
    }
    fetchAvailability()
  }, [formData.property])

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date())
    if (isBefore(date, today)) return true

    const dateStr = format(date, 'yyyy-MM-dd')
    
    // Check manual blocks
    if (availability.blocked.some((b: any) => b.date === dateStr)) return true

    // Check bookings
    return availability.booked.some((b: any) => {
      const start = parseISO(b.check_in)
      const end = parseISO(b.check_out)
      return isWithinInterval(date, { start, end })
    })
  }

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return

    if (!formData.checkIn || (formData.checkIn && formData.checkOut)) {
      setFormData({ ...formData, checkIn: date, checkOut: null })
    } else if (isBefore(date, formData.checkIn)) {
      setFormData({ ...formData, checkIn: date, checkOut: null })
    } else {
      const interval = eachDayOfInterval({ start: formData.checkIn, end: date })
      const hasDisabled = interval.some(d => isDateDisabled(d))
      if (!hasDisabled) {
        setFormData({ ...formData, checkOut: date })
        setShowCalendar(false) // Auto-close on complete selection
      } else {
        setFormData({ ...formData, checkIn: date, checkOut: null })
      }
    }
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const disabled = isDateDisabled(cloneDay)
        const isSelected = (formData.checkIn && isSameDay(day, formData.checkIn)) || 
                           (formData.checkOut && isSameDay(day, formData.checkOut))
        const isInRange = formData.checkIn && formData.checkOut && 
                          isWithinInterval(day, { start: formData.checkIn, end: formData.checkOut })

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-10 flex items-center justify-center text-xs font-medium transition-all cursor-pointer rounded-lg",
              !isSameMonth(day, monthStart) ? "text-text-secondary/20" : "text-primary",
              disabled && "text-red-300 cursor-not-allowed bg-red-50/30 line-through",
              isSelected && "bg-primary text-white z-10",
              isInRange && !isSelected && "bg-primary/10 text-primary",
              !disabled && !isSelected && "hover:bg-surface"
            )}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span>{format(day, "d")}</span>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(<div className="grid grid-cols-7 gap-1" key={day.toString()}>{days}</div>)
      days = []
    }
    return <div className="p-4">{rows}</div>
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.checkIn || !formData.checkOut) {
      alert('Please select your stay dates.')
      return
    }

    const propertyName = properties.find(p => p.id === formData.property)?.name
    
    // Normalize phone for WhatsApp URL
    let normalizedPhone = formData.phone.replace(/\D/g, '')
    if (normalizedPhone.startsWith('0')) {
      normalizedPhone = '263' + normalizedPhone.substring(1)
    } else if (!normalizedPhone.startsWith('263')) {
      normalizedPhone = '263' + normalizedPhone
    }

    const message = `Hello Melina! I would like to book ${propertyName}.
Check-in: ${format(formData.checkIn, 'PPP')}
Check-out: ${format(formData.checkOut, 'PPP')}
Guests: ${formData.guests}
Name: ${formData.name} Phone: ${formData.phone}
Special requests: ${formData.specialRequests}`

    window.open(`https://wa.me/263789907597?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <section id="booking" className="py-24 px-6 bg-surface">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading text-primary mb-4">Book Your Stay</h2>
          <div className="w-20 h-1 bg-accent mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-border space-y-6 relative">
          {/* Property Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center">
              <CalendarIcon className="w-3 h-3 mr-2 text-accent" /> Selected Apartment
            </label>
            <select 
              className="w-full p-4 rounded-xl border border-border focus:border-primary outline-none bg-surface font-medium appearance-none"
              value={formData.property}
              onChange={e => setFormData({...formData, property: e.target.value})}
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Date Selection Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Check-In</label>
              <div 
                onClick={() => setShowCalendar(true)}
                className="w-full p-4 rounded-xl border border-border bg-surface cursor-pointer flex items-center justify-between group hover:border-primary transition-colors"
              >
                <span className={cn("text-sm", !formData.checkIn && "text-text-secondary")}>
                  {formData.checkIn ? format(formData.checkIn, 'MMM d, yyyy') : 'Select Date'}
                </span>
                <CalendarIcon className="w-4 h-4 text-text-secondary group-hover:text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Check-Out</label>
              <div 
                onClick={() => setShowCalendar(true)}
                className="w-full p-4 rounded-xl border border-border bg-surface cursor-pointer flex items-center justify-between group hover:border-primary transition-colors"
              >
                <span className={cn("text-sm", !formData.checkOut && "text-text-secondary")}>
                  {formData.checkOut ? format(formData.checkOut, 'MMM d, yyyy') : 'Select Date'}
                </span>
                <CalendarIcon className="w-4 h-4 text-text-secondary group-hover:text-primary" />
              </div>
            </div>

            {/* Pop-out Calendar */}
            <AnimatePresence>
              {showCalendar && (
                <motion.div 
                  ref={calendarRef}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} type="button" className="p-1 hover:bg-white rounded-full transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="font-heading text-primary">{format(currentMonth, 'MMMM yyyy')}</h3>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} type="button" className="p-1 hover:bg-white rounded-full transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 px-4 pt-4 text-center">
                    {['S','M','T','W','T','F','S'].map(d => (
                      <div key={d} className="text-[10px] font-bold text-text-secondary">{d}</div>
                    ))}
                  </div>
                  {renderCells()}
                  <div className="p-4 bg-surface border-t border-border flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-tighter">
                      <div className="w-2 h-2 bg-red-400 rounded-full" /> Booked
                      <div className="w-2 h-2 bg-primary rounded-full" /> Selected
                    </div>
                    <button 
                      onClick={() => setShowCalendar(false)}
                      type="button"
                      className="text-[10px] font-bold text-primary hover:text-accent flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center">
                <User className="w-3 h-3 mr-2 text-accent" /> Full Name
              </label>
              <input 
                type="text" required
                className="w-full p-4 rounded-xl border border-border focus:border-primary outline-none bg-surface text-sm"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center">
                <Phone className="w-3 h-3 mr-2 text-accent" /> Phone
              </label>
              <input 
                type="tel" required
                className="w-full p-4 rounded-xl border border-border focus:border-primary outline-none bg-surface text-sm"
                placeholder="+263..."
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center">
              <Users className="w-3 h-3 mr-2 text-accent" /> Guests
            </label>
            <input 
              type="number" min="1" max="10"
              className="w-full p-4 rounded-xl border border-border focus:border-primary outline-none bg-surface"
              value={formData.guests}
              onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
            />
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center">
              <MessageSquare className="w-3 h-3 mr-2 text-accent" /> Requests
            </label>
            <textarea 
              className="w-full p-4 rounded-xl border border-border focus:border-primary outline-none bg-surface h-20 text-sm"
              placeholder="Any specific needs?"
              value={formData.specialRequests}
              onChange={e => setFormData({...formData, specialRequests: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-accent transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
          >
            Send Booking Request <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  )
}

export default BookingForm
