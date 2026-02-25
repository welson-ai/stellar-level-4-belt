# 🌊 StellarSwap — DEX on Stellar

[![CI/CD](https://github.com/YOUR_USERNAME/stellarswap/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/stellarswap/actions)
[![Vercel](https://img.shields.io/badge/deployed-vercel-black)](YOUR_VERCEL_URL)

> A decentralized exchange (DEX) with liquidity pools built on Stellar testnet using Soroban smart contracts.

🔴 **Live Demo:** YOUR_VERCEL_URL

---

## ✨ Features
- 🔄 Token swaps using AMM (x*y=k formula)
- 💧 Add & remove liquidity
- ⚡ Real-time activity feed
- 📱 Mobile responsive with tab navigation
- 🔗 Freighter wallet integration
- 🗃️ Smart caching (15s pool refresh)

## 📜 Contract Addresses (Testnet)
| Contract | Address |
|---|---|
| Liquidity Pool | `YOUR_POOL_CONTRACT` |
| Token A (STLR) | `YOUR_TOKEN_A_CONTRACT` |
| Token B (USDC) | `YOUR_TOKEN_B_CONTRACT` |

## 🔄 Inter-Contract Calls
The Liquidity Pool contract makes direct inter-contract calls to Token A and Token B contracts to transfer tokens during swaps and liquidity operations.

## 🛠️ Tech Stack
- Next.js 15, TypeScript, Tailwind CSS v4
- Stellar SDK, Freighter API
- Soroban (Rust smart contracts)
- Jest, GitHub Actions, Vercel

## 🚀 Getting Started
git clone https://github.com/YOUR_USERNAME/stellarswap
cd stellarswap
npm install
npm run dev

## 🧪 Run Tests
npm test

## 📱 Mobile View
[Add screenshot]

## 🔄 CI/CD Pipeline
[Add screenshot]

## 📄 License: MIT
