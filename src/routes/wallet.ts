import { Hono } from 'hono'
import { createPublicClient, http, erc20Abi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { unlinkMiddleware, type UnlinkVariables } from '../middleware/unlink.js'
import { DEFAULT_TOKEN } from '../lib/constants.js'
import { SUPPORTED_TOKENS } from '../config/tokens.js'

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

router.post('/sweep', async (c) => {
  const { evmPrivateKey } = await c.req.json()
  const normalizedKey = (evmPrivateKey.startsWith('0x') ? evmPrivateKey : `0x${evmPrivateKey}`) as `0x${string}`
  const account = privateKeyToAccount(normalizedKey)

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.RPC_URL),
  })

  const balances = await Promise.all(
    SUPPORTED_TOKENS.map(async (token) => {
      const amount = await publicClient.readContract({
        address: token.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account.address],
      })
      return { ...token, amount: amount.toString() }
    })
  )

  const tokensToDeposit = balances.filter((t) => BigInt(t.amount) > 0n)

  return c.json({ address: account.address, tokensToDeposit })
})

export default router
