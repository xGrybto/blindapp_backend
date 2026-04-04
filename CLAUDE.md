# CLAUDE.md

## Contexte projet

Je construis un wallet mobile privé pour un hackathon EthGlobal (Blind Wallet).
Le repo git est déjà initialisé dans le dossier courant. Ne pas toucher au `.git`.

Stack :
- `apps/mobile` — Expo React Native (Expo Router, TypeScript)
- `apps/backend` — Node.js avec Hono (TypeScript), tourne en local
- Monorepo npm workspaces
- Pas de base de données : l'historique des transactions vient de l'API Unlink directement

## Phase 1 — Structure uniquement

Ton seul objectif est de créer la structure de fichiers et d'installer les dépendances.
N'implémente aucune logique métier. Les fichiers `.ts` / `.tsx` doivent contenir uniquement
des stubs (fonctions vides, composants vides, exports vides) avec un commentaire `// TODO`.

### Structure attendue
```
/
├── apps/
│   ├── mobile/
│   │   ├── app/
│   │   │   ├── (tabs)/
│   │   │   │   ├── index.tsx        # TODO: Home / balance screen
│   │   │   │   ├── send.tsx         # TODO: Transfer screen
│   │   │   │   └── receive.tsx      # TODO: Receive screen
│   │   │   └── _layout.tsx          # TODO: Root layout
│   │   ├── components/
│   │   │   └── .gitkeep
│   │   ├── hooks/
│   │   │   └── useWallet.ts         # TODO: hook principal
│   │   ├── services/
│   │   │   └── api.ts               # TODO: appels backend
│   │   ├── utils/
│   │   │   └── keys.ts              # TODO: génération et stockage des clés
│   │   ├── app.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── backend/
│       ├── src/
│       │   ├── index.ts             # stub: entry point Hono
│       │   ├── routes/
│       │   │   ├── wallet.ts        # TODO: GET /balance, /address, /transactions
│       │   │   ├── deposit.ts       # TODO: POST /deposit
│       │   │   ├── transfer.ts      # TODO: POST /transfer
│       │   │   └── withdraw.ts      # TODO: POST /withdraw
│       │   └── lib/
│       │       └── unlink.ts        # TODO: factory createUnlinkClient()
│       ├── package.json
│       └── tsconfig.json
│
├── package.json                     # workspaces root
├── .env.example
└── CLAUDE.md
```

### Dépendances à installer

**`apps/mobile/package.json`**
```json
{
  "name": "mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.2",
    "react-native": "0.76.5",
    "@scure/bip39": "^1.3.0",
    "@scure/bip32": "^1.4.0",
    "viem": "^2.0.0",
    "axios": "^1.7.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.0",
    "typescript": "^5.3.0"
  }
}
```

**`apps/backend/package.json`**
```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "hono": "^4.6.0",
    "@hono/node-server": "^1.13.0",
    "@unlink-xyz/sdk": "latest",
    "viem": "^2.0.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0"
  }
}
```

**`package.json` (root)**
```json
{
  "name": "blind-wallet",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/mobile", "apps/backend"],
  "scripts": {
    "dev:backend": "npm run dev --workspace=apps/backend",
    "dev:mobile": "expo start --project-root apps/mobile"
  }
}
```

### Fichiers de config à générer avec un contenu réel

**`apps/backend/tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**`apps/mobile/tsconfig.json`**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": { "strict": true }
}
```

**`apps/mobile/app.json`**
```json
{
  "expo": {
    "name": "Blind Wallet",
    "slug": "blind-wallet",
    "version": "1.0.0",
    "scheme": "blindwallet",
    "platforms": ["ios", "android"],
    "plugins": ["expo-router", "expo-secure-store"]
  }
}
```

**`.env.example`**
```
# Backend
UNLINK_API_KEY=your_api_key_here
RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
PORT=3000

# Mobile (Expo)
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Stubs attendus

**`apps/backend/src/index.ts`**
```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

const app = new Hono()

app.get('/', (c) => c.json({ status: 'ok' }))

// TODO: monter les routes (wallet, deposit, transfer, withdraw)

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 }, (info) => {
  console.log(`Backend running on http://localhost:${info.port}`)
})
```

**`apps/backend/src/lib/unlink.ts`**
```ts
// TODO: factory createUnlinkClient(mnemonic, evmPrivateKey)
export {}
```

**`apps/backend/src/routes/wallet.ts`**
```ts
import { Hono } from 'hono'
const router = new Hono()
// TODO: GET /balance
// TODO: GET /address
// TODO: GET /transactions
export default router
```

**`apps/backend/src/routes/deposit.ts`**
```ts
import { Hono } from 'hono'
const router = new Hono()
// TODO: POST /deposit
export default router
```

**`apps/backend/src/routes/transfer.ts`**
```ts
import { Hono } from 'hono'
const router = new Hono()
// TODO: POST /transfer
export default router
```

**`apps/backend/src/routes/withdraw.ts`**
```ts
import { Hono } from 'hono'
const router = new Hono()
// TODO: POST /withdraw
export default router
```

**`apps/mobile/hooks/useWallet.ts`**
```ts
import { useState, useEffect } from 'react'

export function useWallet() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    // TODO: charger ou générer le wallet depuis expo-secure-store
    setIsLoading(false)
  }, [])
  return { isLoading }
}
```

**`apps/mobile/utils/keys.ts`**
```ts
// TODO: generateWallet()
// TODO: saveWallet(mnemonic, evmPrivateKey)
// TODO: loadWallet()
export {}
```

**`apps/mobile/services/api.ts`**
```ts
// TODO: client axios vers EXPO_PUBLIC_BACKEND_URL
// TODO: getBalance(), getAddress(), getTransactions(), transfer(), deposit(), withdraw()
export {}
```

**`apps/mobile/app/(tabs)/index.tsx`**
```tsx
import { View, Text } from 'react-native'
export default function HomeScreen() {
  // TODO: afficher le solde Unlink
  return <View><Text>Blind Wallet</Text></View>
}
```

**`apps/mobile/app/(tabs)/send.tsx`**
```tsx
import { View, Text } from 'react-native'
export default function SendScreen() {
  // TODO: formulaire transfer
  return <View><Text>Send</Text></View>
}
```

**`apps/mobile/app/(tabs)/receive.tsx`**
```tsx
import { View, Text } from 'react-native'
export default function ReceiveScreen() {
  // TODO: adresse unlink1... + QR code
  return <View><Text>Receive</Text></View>
}
```

**`apps/mobile/app/_layout.tsx`**
```tsx
import { Tabs } from 'expo-router'
export default function RootLayout() {
  // TODO: configurer les tabs
  return <Tabs />
}
```

## Contraintes

- Ne pas écrire de logique métier (pas d'appels SDK Unlink, pas de crypto)
- Ne pas toucher au `.git` existant
- Tout le code en TypeScript strict
- Lancer `npm install` depuis la racine après avoir créé tous les `package.json`

## À la fin

Affiche :
1. L'arbre de fichiers créés
2. Les éventuelles erreurs d'installation npm
3. La commande pour vérifier que le backend démarre : `npm run dev:backend`


## Contraintes

- Ne pas écrire de logique métier (pas d'appels SDK Unlink, pas de crypto)
- Tout le code en TypeScript strict
- Lancer `npm install` depuis la racine après avoir créé tous les `package.json`

## À la fin

Affiche :
1. L'arbre de fichiers créés
2. Les éventuelles erreurs d'installation npm
3. La commande pour vérifier que le backend démarre : `npm run dev:backend`