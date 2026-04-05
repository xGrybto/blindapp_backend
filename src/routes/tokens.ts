import { Hono } from 'hono'
import { SUPPORTED_TOKENS } from '../config/tokens.js'

const router = new Hono()

router.get('/', (c) => {
  return c.json({ tokens: SUPPORTED_TOKENS })
})

export default router
