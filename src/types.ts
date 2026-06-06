export interface Property {
  id: string
  name: string
  label: string
  price: number
  description: string
  capacity: number
  address?: string
  is_full_width: boolean
}

export interface Booking {
  id: string
  property_id: string
  customer_name: string
  customer_phone: string
  check_in: string
  check_out: string
  guests: number
  stay_type: string
  special_requests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export interface BlockedDate {
  id: string
  property_id: string
  date: string
  reason?: string
}
