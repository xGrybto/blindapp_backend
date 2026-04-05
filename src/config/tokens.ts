export const SUPPORTED_TOKENS = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    decimals: 6,
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
  },
  {
    symbol: 'TEST',
    name: 'Unlink Test Token',
    address: '0x7501de8ea37a21e20e6e65947d2ecab0e9f061a7',
    decimals: 18,
  },
] as const

export type Token = typeof SUPPORTED_TOKENS[number]
