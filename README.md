# StellarSwap — Decentralized Exchange on Stellar

[![CI/CD Pipeline](https://github.com/welson-ai/stellarswap/actions/workflows/ci.yml/badge.svg)](https://github.com/welson-ai/stellarswap/actions)
[![Vercel Deploy](https://img.shields.io/badge/deployed-vercel-black?logo=vercel)](YOUR_VERCEL_URL)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue?logo=stellar)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)

> A fully functional Decentralized Exchange (DEX) built on the Stellar blockchain using Soroban smart contracts. Swap tokens, provide liquidity, and earn fees — all in a beautiful, mobile-responsive interface.

---

## Live Demo

**(https://stellar-level-4-belt.vercel.app/)**

---

## Screenshots

![Desktop View](.public/images/desktop-view.jpeg)
![Mobile View](/images/mobile-view.png)

### CI/CD Pipeline
> _Add your GitHub Actions screenshot here_

---

## Features

### Token Swapping
- Swap between STLR and USDC tokens instantly
- Real-time price calculation using AMM formula
- Price impact warnings (yellow >1%, red >5%)
- Adjustable slippage tolerance (0.5% / 1% / 2%)
- Transaction confirmation with success feedback

### Liquidity Pools
- Add liquidity with any ratio of STLR/USDC
- Auto-calculate optimal token ratios based on pool state
- View your estimated LP token share
- Remove liquidity and receive back underlying tokens
- Real-time pool stats (reserves, prices, total liquidity)

### Real-Time Activity Feed
- Live feed of all swap and liquidity events
- Event type indicators (swap, add liquidity, remove liquidity)
- Timestamps and wallet addresses for every action
- Automatically updates with every transaction

### Mobile Responsive
- Fully responsive design for all screen sizes
- Bottom tab navigation on mobile (Swap / Pool / Activity)
- Desktop 3-column grid layout
- Sticky header with wallet status

### Wallet Integration
- Connect with Freighter wallet (Stellar's MetaMask equivalent)
- Display wallet address and TESTNET network badge
- One-click disconnect
- Fund testnet account via Friendbot

### Performance & Caching
- Pool state cached for 15 seconds to reduce API calls
- Auto-refresh pool data every 15 seconds
- Smart cache invalidation on every swap or liquidity action

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              Next.js Frontend               │
│                                             │
│  ┌──────────┐ ┌───────────┐ ┌───────────┐  │
│  │ SwapCard │ │Liquidity  │ │ LiveFeed  │  │
│  │          │ │Card       │ │           │  │
│  └──────────┘ └───────────┘ └───────────┘  │
│         │            │                     │
│  ┌──────▼────────────▼──────────────────┐  │
│  │     useDex Hook + useWallet Hook     │  │
│  └──────────────────┬───────────────────┘  │
└─────────────────────│───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│         Soroban Smart Contracts             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │       Liquidity Pool Contract       │    │
│  │  - add_liquidity()                  │    │
│  │  - swap()           ┌────────────┐  │    │
│  │  - get_reserves() ──► Token A    │  │    │
│  │                     │ Contract   │  │    │
│  │  Inter-contract ────► (STLR)    │  │    │
│  │  calls              └────────────┘  │    │
│  │                     ┌────────────┐  │    │
│  │                  ───► Token B    │  │    │
│  │                     │ Contract   │  │    │
│  │                     │ (USDC)    │  │    │
│  │                     └────────────┘  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│           GitHub Actions CI/CD              │
│   Test → Lint → Type Check → Deploy        │
│                  ▼                          │
│              Vercel                         │
└─────────────────────────────────────────────┘
```

---

## How the AMM Works

StellarSwap uses the **Constant Product Market Maker (CPMM)** formula:

```
x * y = k
```

Where:
- `x` = Reserve of Token A (STLR)
- `y` = Reserve of Token B (USDC)
- `k` = Constant (never changes)

### Swap Calculation
```
amountOut = (amountIn * 0.997 * reserveOut) / (reserveIn + amountIn * 0.997)
```
The `0.997` accounts for the **0.3% trading fee** that goes to liquidity providers.

### Price Impact
```
priceImpact = (amountIn / (reserveIn + amountIn)) * 100
```

### LP Token Minting
```
# First deposit
lpTokens = sqrt(amountA * amountB)

# Subsequent deposits
lpTokens = min(amountA/reserveA, amountB/reserveB) * totalSupply
```

---

## Smart Contracts

### Contract Addresses (Testnet)

| Contract | Address | Explorer |
|---|---|---|
| Liquidity Pool | `YOUR_POOL_CONTRACT_ADDRESS` | [View ↗](https://stellar.expert/explorer/testnet/contract/YOUR_POOL_CONTRACT_ADDRESS) |
| Token A (STLR) | `YOUR_TOKEN_A_ADDRESS` | [View ↗](https://stellar.expert/explorer/testnet/contract/YOUR_TOKEN_A_ADDRESS) |
| Token B (USDC) | `YOUR_TOKEN_B_ADDRESS` | [View ↗](https://stellar.expert/explorer/testnet/contract/YOUR_TOKEN_B_ADDRESS) |

### Deployment Transaction Hashes

| Action | Transaction Hash |
|---|---|
| Pool Deploy | `YOUR_DEPLOY_TX_HASH` |
| Token A Deploy | `YOUR_TOKEN_A_TX_HASH` |
| Token B Deploy | `YOUR_TOKEN_B_TX_HASH` |
| Pool Initialize | `YOUR_INIT_TX_HASH` |

### Inter-Contract Calls

The **Liquidity Pool contract** makes direct inter-contract calls to the Token contracts:

```rust
// During swap — calls Token A and Token B contracts directly
token::TokenClient::new(&env, &token_a)
    .transfer(&user, &env.current_contract_address(), &amount_in);

token::TokenClient::new(&env, &token_b)
    .transfer(&env.current_contract_address(), &user, &amount_out);
```

This means a single `swap()` call on the Pool contract triggers:
1. Token A transfer (user → pool) via Token A contract
2. Token B transfer (pool → user) via Token B contract

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Blockchain | Stellar Testnet |
| Smart Contracts | Soroban (Rust) |
| Wallet | Freighter API |
| Stellar SDK | @stellar/stellar-sdk |
| Testing | Jest + Testing Library |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Rust** (for building Soroban contracts)
- **Soroban CLI** (`cargo install --locked soroban-cli`)
- **Freighter Wallet** browser extension → [freighter.app](https://freighter.app)
- A **Stellar Testnet account** (use Friendbot to fund)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/stellarswap.git
cd stellarswap
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_POOL_CONTRACT=your_pool_contract_address
NEXT_PUBLIC_TOKEN_A_CONTRACT=your_token_a_address
NEXT_PUBLIC_TOKEN_B_CONTRACT=your_token_b_address
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Test Results

```
 PASS  src/__tests__/cache.test.ts
 PASS  src/__tests__/amm.test.ts
 PASS  src/__tests__/pool.test.ts

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
```

### What's Being Tested

| Test File | What It Tests |
|---|---|
| `cache.test.ts` | Cache set/get, TTL expiry, clear function |
| `amm.test.ts` | AMM swap math, price impact, pool prices |
| `pool.test.ts` | Pool state, swap execution, liquidity operations |

---

## Building Soroban Contracts

### Install Soroban CLI

```bash
cargo install --locked soroban-cli --features opt
rustup target add wasm32-unknown-unknown
```

### Build Contracts

```bash
# Build Liquidity Pool
cd contracts/liquidity-pool
cargo build --target wasm32-unknown-unknown --release

# Optimize WASM
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/liquidity_pool.wasm
```

### Deploy to Testnet

```bash
# Set up your account
soroban keys generate default --network testnet
soroban keys fund default --network testnet

# Deploy pool contract
soroban contract deploy \
  --wasm contracts/liquidity-pool/target/wasm32-unknown-unknown/release/liquidity_pool.optimized.wasm \
  --network testnet \
  --source-account default
```

---

## Project Structure

```
stellarswap/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── contracts/
│   ├── liquidity-pool/
│   │   ├── Cargo.toml
│   │   └── src/lib.rs          # AMM pool Soroban contract
│   ├── token-a/
│   │   ├── Cargo.toml
│   │   └── src/lib.rs          # STLR token contract
│   └── token-b/
│       ├── Cargo.toml
│       └── src/lib.rs          # USDC token contract
├── scripts/
│   └── deploy.sh               # Contract deployment script
├── src/
│   ├── app/
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main DEX page
│   ├── components/
│   │   ├── LoadingSpinner.tsx  # Reusable spinner
│   │   ├── WalletConnect.tsx   # Wallet connection hero
│   │   ├── PoolStats.tsx       # Pool metrics bar
│   │   ├── SwapCard.tsx        # Token swap interface
│   │   ├── LiquidityCard.tsx   # Add/remove liquidity
│   │   └── LiveFeed.tsx        # Real-time activity feed
│   ├── hooks/
│   │   ├── useWallet.ts        # Freighter wallet hook
│   │   └── useDex.ts           # DEX operations hook
│   ├── lib/
│   │   ├── amm.ts              # AMM math (x*y=k)
│   │   ├── cache.ts            # In-memory cache
│   │   ├── pool.ts             # Pool state management
│   │   └── stellar.ts          # Stellar SDK helpers
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── __tests__/
│       ├── cache.test.ts
│       ├── amm.test.ts
│       └── pool.test.ts
├── .env.local.example
├── jest.config.cjs
├── jest.setup.ts
├── next.config.js
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## CI/CD Pipeline

Every push to `main` or `develop` triggers the GitHub Actions pipeline:

```
Push to GitHub
      │
      ▼
┌─────────────┐     ┌─────────────┐
│  ✅ Tests   │     │ 🔍 Lint &   │
│  npm test   │     │ Type Check  │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │ (both must pass)
                 ▼
         ┌──────────────┐
         │ 🚀 Deploy to │
         │   Vercel     │
         │ (main only)  │
         └──────────────┘
```

### Setting Up CI/CD Secrets

In your GitHub repo go to **Settings → Secrets → Actions** and add:

| Secret | How to Get It |
|---|---|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Run `vercel env ls` in terminal |
| `VERCEL_PROJECT_ID` | Run `vercel env ls` in terminal |

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

After deploying, add environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## How to Use the App

### Step 1 — Install Freighter
Download and install the [Freighter wallet](https://freighter.app) browser extension.

### Step 2 — Switch to Testnet
Open Freighter → click the network selector → choose **Test Net**.

### Step 3 — Connect Wallet
Click **"Connect Freighter Wallet"** on the app and approve the connection.

### Step 4 — Fund Your Account
Click **"Fund with Friendbot"** to receive free testnet XLM.

### Step 5 — Swap Tokens
- Enter an amount in the Swap card
- See the real-time output amount and price impact
- Click **"Swap Tokens"** and approve in Freighter

### Step 6 — Add Liquidity
- Go to the Pool tab
- Enter amounts for STLR and USDC
- Click **"Add Liquidity"** to receive LP tokens and start earning fees

---

## Security Notes

- This is built on **Stellar Testnet** — do not use real funds
- Smart contracts are unaudited — for educational purposes only
- Private keys never leave your Freighter wallet
- All transactions are signed client-side

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [Stellar Development Foundation](https://stellar.org) for Soroban
- [Freighter](https://freighter.app) for the wallet SDK
- [Uniswap](https://uniswap.org) for the AMM inspiration
