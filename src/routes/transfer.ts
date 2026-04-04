import { Hono } from 'hono'
import { unlinkMiddleware, type UnlinkVariables } from '../middleware/unlink.js'

const TOKEN = '0x7501de8ea37a21e20e6e65947d2ecab0e9f061a7'

const router = new Hono<{ Variables: UnlinkVariables }>()

router.post('/', unlinkMiddleware, async (c) => {
  const { recipientAddress, amount, token = TOKEN } = await c.req.json()
  const unlink = c.get('unlink')

  const result = await unlink.transfer({ recipientAddress, token, amount })
  const confirmed = await unlink.pollTransactionStatus(result.txId)
  return c.json(confirmed)
})

export default router
