import { Hono } from 'hono'
import { createUnlinkClient } from '../lib/unlink.js'

const TOKEN = '0x7501de8ea37a21e20e6e65947d2ecab0e9f061a7'

const router = new Hono()

router.post('/', async (c) => {
  const { unlinkMnemonic, evmPrivateKey, target, token = TOKEN } = await c.req.json()
  const unlink = createUnlinkClient(unlinkMnemonic, evmPrivateKey)

  if (target === 'eoa') {
    const result = await unlink.faucet.requestTestTokens({ token })
    return c.json(result)
  }

  if (target === 'unlink') {
    const result = await unlink.faucet.requestPrivateTokens({ token })
    return c.json(result)
  }

  return c.json({ error: 'target must be "eoa" or "unlink"' }, 400)
})

export default router
