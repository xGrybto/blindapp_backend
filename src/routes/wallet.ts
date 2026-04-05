import { Hono } from 'hono'
import { createPublicClient, http, erc20Abi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { unlinkMiddleware, type UnlinkVariables } from '../middleware/unlink.js'
import { DEFAULT_TOKEN } from '../lib/constants.js'

const router = new Hono<{ Variables: UnlinkVariables }>()

router.post('/address', unlinkMiddleware, async (c) => {
  const unlink = c.get('unlink')
  const address = await unlink.getAddress()
  return c.json({ address })
})

router.post('/unlink', unlinkMiddleware, async (c) => {
  const unlink = c.get('unlink')
  const { balances } = await unlink.getBalances()
  return c.json({ balances })
})

router.post('/public', async (c) => {
  const { evmPrivateKey, token = DEFAULT_TOKEN } = await c.req.json()
  const normalizedKey = (evmPrivateKey.startsWith('0x') ? evmPrivateKey : `0x${evmPrivateKey}`) as `0x${string}`
  const account = privateKeyToAccount(normalizedKey)

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.RPC_URL),
  })

  const amount = await publicClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account.address],
  })

  return c.json({
    address: account.address,
    token,
    amount: amount.toString(),
  })
})

export default router
