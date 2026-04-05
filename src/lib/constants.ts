import { SUPPORTED_TOKENS } from '../config/tokens.js'

export const DEFAULT_TOKEN = SUPPORTED_TOKENS.find(t => t.symbol === 'TEST')!.address
