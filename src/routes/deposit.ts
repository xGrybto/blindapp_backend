import { Hono } from 'hono'
import { unlinkMiddleware, type UnlinkVariables } from '../middleware/unlink.js'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { DEFAULT_TOKEN } from '../lib/constants.js'

const router = new Hono<{ Variables: UnlinkVariables }>()

router.post('/', unlinkMiddleware, async (c) => {
  const { amount, token = DEFAULT_TOKEN } = await c.req.json()
  const unlink = c.get('unlink')

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.RPC_URL),
  })

  const approval = await unlink.ensureErc20Approval({ token, amount })

  if (approval.status === 'submitted') {
    await publicClient.waitForTransactionReceipt({
      hash: approval.txHash as `0x${string}`,
    })
  }

  const result = await unlink.deposit({ token, amount })
  const confirmed = await unlink.pollTransactionStatus(result.txId)
  return c.json(confirmed)
})

export default router
