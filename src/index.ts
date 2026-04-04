import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

const app = new Hono()

app.get('/', (c) => c.json({ status: 'ok' }))

// TODO: monter les routes (wallet, deposit, transfer, withdraw)

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 }, (info) => {
  console.log(`Backend running on http://localhost:${info.port}`)
})
