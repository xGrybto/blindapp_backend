# BlindApp — Backend

Stateless backend for a mobile wallet enabling private ERC-20 transactions on Base Sepolia via the Unlink SDK (Zero Knowledge Proofs). The backend stores no keys or user data — each request receives secrets from the mobile client, executes the operation, and returns the result.

## Front-end project 

https://github.com/iyarsius/blindapp

## Setup

```bash
npm install
cp .env.example .env  # fill in UNLINK_API_KEY and RPC_URL
npm run dev
```

## Environment variables

| Variable         | Description                                                  |
|------------------|--------------------------------------------------------------|
| `UNLINK_API_KEY` | Unlink API key — [hackaton-apikey.vercel.app](https://hackaton-apikey.vercel.app) |
| `RPC_URL`        | Base Sepolia RPC URL (e.g. Alchemy)                         |
| `PORT`           | Server port (default: 3000)                                 |

## API

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/init` | Generates a BIP-39 mnemonic and an EVM private key — called once on app install. |
| GET | `/tokens` | Returns the static list of supported ERC-20 tokens. |
| POST | `/wallet/address` | Returns the Unlink address (`unlink1...`) derived from the mnemonic. |
| POST | `/wallet/unlink` | Returns the private token balances in the Unlink pool. |
| POST | `/wallet/public` | Returns the on-chain ERC-20 balance of the EOA via viem. |
| POST | `/wallet/sweep` | Reads EOA balances for all supported tokens and returns those with a positive amount. |
| POST | `/deposit` | Approves the token for Permit2 if needed, then deposits ERC-20 tokens from the EOA into the Unlink pool. |
| POST | `/transfer` | Transfers tokens between two Unlink accounts — sender, recipient, amount and token are all private on-chain. |
| POST | `/withdraw` | Withdraws tokens from the Unlink pool to a public EVM address — the Unlink sender remains private. |
| POST | `/transactions` | Returns the transaction history of the Unlink account (optional `limit` parameter, default 20). |

## Testing

The Bruno collection is in `bruno/`. Open the folder in Bruno, select the `local` environment, then test in order:

```
POST /init → POST /wallet/address → POST /wallet/sweep → POST /deposit → POST /wallet/unlink → POST /transfer → POST /withdraw → POST /transactions
```
