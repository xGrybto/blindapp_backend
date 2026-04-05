import { Hono } from 'hono'
import { unlinkMiddleware, type UnlinkVariables } from '../middleware/unlink.js'
import { DEFAULT_TOKEN } from '../lib/constants.js'

const router = new Hono<{ Variables: UnlinkVariables }>()

router.post('/', unlinkMiddleware, async (c) => {
  const { recipientAddress, amount, token = DEFAULT_TOKEN } = await c.req.json()
  const unlink = c.get('unlink')

  const result = await unlink.transfer({ recipientAddress, token, amount })
  const confirmed = await unlink.pollTransactionStatus(result.txId)
  return c.json(confirmed)
})

export default router
