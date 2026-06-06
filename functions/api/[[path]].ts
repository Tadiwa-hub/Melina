import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

type Bindings = {
  DB: D1Database
  ADMIN_PASSWORD: string
}

// Ensure the basePath matches the folder structure (/functions/api)
const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

// --- Routes ---

app.get('/properties', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM properties').all()
  return c.json(results)
})

app.get('/availability', async (c) => {
  const propertyId = c.req.query('property_id')
  if (!propertyId) return c.json({ error: 'property_id is required' }, 400)

  const { results: booked } = await c.env.DB.prepare(
    'SELECT check_in, check_out FROM bookings WHERE property_id = ? AND status != "cancelled"'
  ).bind(propertyId).all()

  const { results: blocked } = await c.env.DB.prepare(
    'SELECT date FROM blocked_dates WHERE property_id = ?'
  ).bind(propertyId).all()

  return c.json({ booked, blocked })
})

app.post('/bookings', async (c) => {
  const body = await c.req.json()
  const id = crypto.randomUUID()
  
  await c.env.DB.prepare(
    'INSERT INTO bookings (id, property_id, customer_name, customer_phone, check_in, check_out, guests, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    id, 
    body.property_id, 
    body.customer_name, 
    body.customer_phone, 
    body.check_in, 
    body.check_out, 
    body.guests, 
    body.special_requests
  ).run()

  return c.json({ success: true, id })
})

// --- Admin ---

app.post('/admin/login', async (c) => {
  const { password } = await c.req.json()
  if (password === c.env.ADMIN_PASSWORD) {
    return c.json({ success: true })
  }
  return c.json({ success: false }, 401)
})

app.get('/admin/bookings', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all()
  return c.json(results)
})

app.patch('/admin/bookings/:id', async (c) => {
  const id = c.req.param('id')
  const { status } = await c.req.json()
  await c.env.DB.prepare('UPDATE bookings SET status = ? WHERE id = ?').bind(status, id).run()
  return c.json({ success: true })
})

app.post('/admin/block-dates', async (c) => {
  const { property_id, dates, reason } = await c.req.json()
  const stmt = c.env.DB.prepare('INSERT INTO blocked_dates (id, property_id, date, reason) VALUES (?, ?, ?, ?)')
  
  const batch = dates.map((date: string) => stmt.bind(crypto.randomUUID(), property_id, date, reason))
  await c.env.DB.batch(batch)
  
  return c.json({ success: true })
})

export const onRequest = handle(app)
