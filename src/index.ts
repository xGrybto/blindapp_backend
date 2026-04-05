import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

import initRouter from './routes/init.js'
import faucetRouter from './routes/faucet.js'
import walletRouter from './routes/wallet.js'
import depositRouter from './routes/deposit.js'
import transferRouter from './routes/transfer.js'
import withdrawRouter from './routes/withdraw.js'

const app = new Hono()

app.get('/', (c) => c.json({ status: 'ok' }))

app.route('/init', initRouter)
app.route('/faucet', faucetRouter)
app.route('/balance', walletRouter)
app.route('/deposit', depositRouter)
app.route('/transfer', transferRouter)
app.route('/withdraw', withdrawRouter)

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 }, (info) => {
  console.log(`Backend running on http://localhost:${info.port}`)
})
