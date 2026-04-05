# Blind Wallet — Backend

Backend stateless pour un wallet mobile de transactions ERC-20 privées sur Base Sepolia, via le SDK Unlink (Zero Knowledge Proofs). Le backend ne stocke aucune clé ni donnée utilisateur — chaque requête reçoit les secrets du mobile, exécute l'opération, et retourne le résultat.

## Setup

```bash
npm install
cp .env.example .env  # remplir UNLINK_API_KEY et RPC_URL
npm run dev
```

## Variables d'environnement

| Variable        | Description                                      |
|-----------------|--------------------------------------------------|
| `UNLINK_API_KEY` | Clé API Unlink — [hackaton-apikey.vercel.app](https://hackaton-apikey.vercel.app) |
| `RPC_URL`        | RPC Base Sepolia (ex: Alchemy)                  |
| `PORT`           | Port du serveur (défaut: 3000)                  |

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/init` | Génère un mnemonic BIP-39 et une clé privée EVM — appelé une seule fois à l'installation. |
| GET | `/tokens` | Retourne la liste statique des tokens ERC-20 supportés. |
| POST | `/wallet/address` | Retourne l'adresse Unlink (`unlink1...`) associée au mnemonic. |
| POST | `/wallet/unlink` | Retourne les soldes privés dans le pool Unlink. |
| POST | `/wallet/public` | Retourne le solde ERC-20 on-chain de l'EOA via viem. |
| POST | `/wallet/sweep` | Lit les balances ERC-20 de l'EOA pour tous les tokens supportés et retourne ceux dont le montant est positif. |
| POST | `/deposit` | Approuve le token pour Permit2 si nécessaire, puis dépose des tokens ERC-20 depuis l'EOA dans le pool Unlink. |
| POST | `/transfer` | Transfère des tokens entre deux comptes Unlink — sender, recipient, montant et token sont tous privés on-chain. |
| POST | `/withdraw` | Retire des tokens du pool Unlink vers une adresse EVM publique — le sender Unlink reste privé. |
| POST | `/transactions` | Retourne l'historique des transactions du compte Unlink (paramètre `limit` optionnel, défaut 20). |

## Tests

La collection Bruno est dans `bruno/`. Ouvrir le dossier dans Bruno, sélectionner l'environnement `local`, puis tester dans l'ordre :

```
POST /init → POST /wallet/address → POST /wallet/sweep → POST /deposit → POST /wallet/unlink → POST /transfer → POST /withdraw → POST /transactions
```
