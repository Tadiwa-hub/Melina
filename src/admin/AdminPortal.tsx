import { useState, useEffect, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Plus,
  MessageSquare,
  Lock,
  Smartphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '../lib/utils'
import type { Booking } from '../types'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  addDays
} from 'date-fns'

const properties = [
  { id: 'aviemore-apartment', name: 'Aviemore Apartment' },
  { id: 'clairewood-2bed', name: 'Clairewood 2-Bed' },
  { id: 'peterhouse-apartments', name: 'Peterhouse Apartments' }
]

const AdminPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('bookings')
  const [propertyTab, setPropertyTab] = useState('aviemore-apartment')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [selectedToBlock, setSelectedToBlock] = useState<string[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    if (password === 'Melina2026') {
      setIsAuthenticated(true)
      fetchBookings()
      fetchBlockedDates()
    } else {
      alert('Incorrect password')
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (err) {
      console.error('Failed to fetch bookings', err)
    }
  }

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch(`/api/availability?property_id=${propertyTab}`)
      if (res.ok) {
        const data = await res.json()
        setBlockedDates(data.blocked.map((b: any) => b.date))
      }
    } catch (err) {
      console.error('Failed to fetch blocked dates', err)
    }
  }

  useEffect(() => {
    if (isAuthenticated) fetchBlockedDates()
  }, [propertyTab, isAuthenticated])

  const handleBlockDates = async () => {
    if (selectedToBlock.length === 0) return
    try {
      const res = await fetch('/api/admin/block-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyTab,
          dates: selectedToBlock,
          reason: 'Manual Block'
        })
      })
      if (res.ok) {
        fetchBlockedDates()
        setSelectedToBlock([])
        alert('Dates blocked successfully')
      }
    } catch (err) {
      console.error('Failed to block dates', err)
    }
  }

  const toggleDateSelection = (dateStr: string) => {
    if (blockedDates.includes(dateStr)) return
    setSelectedToBlock(prev => 
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    )
  }

  const updateBookingStatus = async (id: string, status: string, booking: Booking) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        fetchBookings()
        
        // Handle WhatsApp Notification
        // Remove all non-numeric characters
        let rawPhone = booking.customer_phone.replace(/\D/g, '')
        
        if (rawPhone.startsWith('0')) {
          // If starts with 0, remove it and add 263
          rawPhone = '263' + rawPhone.substring(1)
        } else if (rawPhone.startsWith('263')) {
          // Already has 263, keep it
        } else {
          // No country code, assume 263
          rawPhone = '263' + rawPhone
        }

        const propertyName = booking.property_id.split('-')[0].charAt(0).toUpperCase() + booking.property_id.split('-')[0].slice(1)
        
        let msg = ''
        if (status === 'confirmed') {
          msg = `Hi ${booking.customer_name}! Your booking for ${propertyName} from ${booking.check_in} to ${booking.check_out} with Melina is confirmed. We look forward to hosting you! 🏡`
        } else if (status === 'cancelled') {
          msg = `Hi ${booking.customer_name}, unfortunately your booking for ${propertyName} on ${booking.check_in} cannot be accommodated. Please contact us to find an alternative date.`
        }

        if (msg) {
          window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(msg)}`, '_blank')
        }
      }
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="text-4xl logo-font text-primary mb-2">melina</div>
            <p className="text-text-secondary text-sm">Admin Portal Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-primary uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border outline-none focus:border-primary bg-surface"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-accent transition-all shadow-lg active:scale-95">
              Enter Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  const filteredBookings = bookings.filter(b => b.property_id === propertyTab)

  return (
    <div className="min-h-screen bg-surface pb-24 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-primary text-white flex-col shadow-2xl z-30">
        <div className="p-8">
          <div className="text-3xl logo-font">melina</div>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-bold">Management</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { id: 'bookings', label: 'Bookings', icon: <LayoutDashboard className="w-5 h-5" /> },
            { id: 'calendar', label: 'Availability', icon: <Calendar className="w-5 h-5" /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === tab.id ? "bg-accent text-white shadow-lg" : "hover:bg-white/10"
              )}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-white flex justify-around items-center p-4 z-50 border-t border-white/10">
        {[
          { id: 'bookings', icon: <LayoutDashboard className="w-6 h-6" />, label: 'Bookings' },
          { id: 'calendar', icon: <Calendar className="w-6 h-6" />, label: 'Dates' },
          { id: 'logout', icon: <LogOut className="w-6 h-6" />, label: 'Exit' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => tab.id === 'logout' ? setIsAuthenticated(false) : setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === tab.id ? "text-accent" : "text-white/60"
            )}
          >
            {tab.icon}
            <span className="text-[10px] font-bold uppercase">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="p-4 md:p-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-heading text-primary capitalize">{activeTab}</h1>
            <p className="text-xs text-text-secondary mt-1 italic">Real-time management for Melina Apartments</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {properties.map(p => (
              <button
                key={p.id}
                onClick={() => setPropertyTab(p.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border shadow-sm flex-1 md:flex-none",
                  propertyTab === p.id 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white text-primary border-border hover:bg-surface"
                )}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </header>

        {activeTab === 'bookings' ? (
          <div className="space-y-6">
            {/* Stats - Horizontal Scroll on Mobile */}
            <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {[
                { label: 'Total', val: bookings.length, icon: <Users className="text-primary" /> },
                { label: 'Pending', val: bookings.filter(b => b.status === 'pending').length, icon: <MessageSquare className="text-amber-500" /> },
                { label: 'Confirmed', val: bookings.filter(b => b.status === 'confirmed').length, icon: <CheckCircle className="text-green-500" /> }
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-border shadow-sm min-w-[160px] flex-1">
                  <div className="mb-4">{s.icon}</div>
                  <div className="text-3xl font-heading text-primary">{s.val}</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">{s.label}</div>
                </div>
              ))}
            </div>

            {/* List for Mobile, Table for Desktop */}
            <div className="space-y-4 md:hidden">
               {filteredBookings.length === 0 ? (
                 <div className="bg-white p-10 rounded-2xl border border-dashed border-border text-center text-text-secondary italic">
                   No bookings found for this property.
                 </div>
               ) : (
                 filteredBookings.map(b => (
                   <div key={b.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
                     <div className="flex justify-between items-start">
                       <div>
                         <div className="font-bold text-primary">{b.customer_name}</div>
                         <div className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                           <Smartphone className="w-3 h-3" /> {b.customer_phone}
                         </div>
                       </div>
                       <span className={cn(
                         "px-2 py-1 rounded text-[8px] font-bold uppercase",
                         b.status === 'pending' ? "bg-amber-100 text-amber-700" :
                         b.status === 'confirmed' ? "bg-green-100 text-green-700" :
                         "bg-red-100 text-red-700"
                       )}>
                         {b.status}
                       </span>
                     </div>
                     <div className="flex gap-4 text-xs">
                        <div>
                          <span className="block text-[8px] font-bold text-text-secondary uppercase">Check-in</span>
                          {b.check_in}
                        </div>
                        <div>
                          <span className="block text-[8px] font-bold text-text-secondary uppercase">Check-out</span>
                          {b.check_out}
                        </div>
                     </div>
                     <div className="flex gap-2 pt-2">
                       <button 
                        onClick={() => updateBookingStatus(b.id, 'confirmed', b)}
                        className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100"
                       >
                         Confirm
                       </button>
                       <button 
                        onClick={() => updateBookingStatus(b.id, 'cancelled', b)}
                        className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100"
                       >
                         Cancel
                       </button>
                     </div>
                   </div>
                 ))
               )}
            </div>

            <div className="hidden md:block bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Dates</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary">{b.customer_name}</div>
                        <div className="text-xs text-text-secondary">{b.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-primary font-medium">{b.check_in} — {b.check_out}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          b.status === 'pending' ? "bg-amber-100 text-amber-700" :
                          b.status === 'confirmed' ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => updateBookingStatus(b.id, 'confirmed', b)}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Confirm via WhatsApp"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateBookingStatus(b.id, 'cancelled', b)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Cancel via WhatsApp"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-text-secondary italic">
                        No bookings found for this property.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div className="text-left">
                <h3 className="text-2xl font-heading text-primary">Availability for {propertyTab.split('-')[0]}</h3>
                <p className="text-xs text-text-secondary italic mt-1">Select dates to block. Slashed dates are removed from the frontend.</p>
              </div>
              <button 
               onClick={handleBlockDates}
               disabled={selectedToBlock.length === 0}
               className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" /> Save {selectedToBlock.length} Blocks
              </button>
            </div>

            {/* Simple Admin Calendar */}
            <div className="space-y-4">
               <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border">
                 <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-white rounded-full">
                   <ChevronLeft className="w-4 h-4" />
                 </button>
                 <span className="font-bold text-primary">{format(currentMonth, 'MMMM yyyy')}</span>
                 <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-white rounded-full">
                   <ChevronRight className="w-4 h-4" />
                 </button>
               </div>

               <div className="grid grid-cols-7 gap-2">
                 {['S','M','T','W','T','F','S'].map(d => (
                   <div key={d} className="text-center text-[10px] font-bold text-text-secondary py-2">{d}</div>
                 ))}
                 {(() => {
                   const monthStart = startOfMonth(currentMonth)
                   const monthEnd = endOfMonth(monthStart)
                   const startDate = startOfWeek(monthStart)
                   const endDate = endOfWeek(monthEnd)
                   const days = []
                   let day = startDate
                   while (day <= endDate) {
                     const dateStr = format(day, 'yyyy-MM-dd')
                     const isBlocked = blockedDates.includes(dateStr)
                     const isSelected = selectedToBlock.includes(dateStr)
                     const isCurrentMonth = isSameMonth(day, monthStart)

                     const d = day
                     days.push(
                       <div 
                         key={dateStr}
                         onClick={() => isCurrentMonth && toggleDateSelection(dateStr)}
                         className={cn(
                           "aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all border",
                           !isCurrentMonth ? "opacity-0 pointer-events-none" : "cursor-pointer",
                           isBlocked ? "bg-red-100 text-red-700 border-red-200 line-through" :
                           isSelected ? "bg-primary text-white border-primary shadow-md" :
                           "bg-surface text-text-secondary border-border hover:border-primary/30"
                         )}
                       >
                         {format(d, 'd')}
                         {isBlocked && <span className="text-[6px] uppercase mt-1">Blocked</span>}
                       </div>
                     )
                     day = addDays(day, 1)
                   }
                   return days
                 })()}
               </div>
            </div>
         </div>
        )}
      </main>
    </div>
  )
}

export default AdminPortal
