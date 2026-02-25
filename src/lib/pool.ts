// Simulates pool state for the DEX
// In production this reads from the Soroban contract

import { cache } from './cache';
import { PoolState } from '@/types';

const POOL_CACHE_KEY = 'pool_state';
const POOL_TTL = 15000; // 15 seconds

let mockPool = {
  reserveA: 10000,  // STLR tokens
  reserveB: 5000,   // USDC tokens
  totalLiquidity: 7071,
  fee: '0.3',
};

export async function getPoolState(): Promise<PoolState> {
  const cached = cache.get<PoolState>(POOL_CACHE_KEY);
  if (cached) return cached;

  const priceAtoB = mockPool.reserveB / mockPool.reserveA;
  const priceBtoA = mockPool.reserveA / mockPool.reserveB;

  const state: PoolState = {
    reserveA: mockPool.reserveA.toFixed(2),
    reserveB: mockPool.reserveB.toFixed(2),
    totalLiquidity: mockPool.totalLiquidity.toFixed(2),
    priceAtoB: priceAtoB.toFixed(4),
    priceBtoA: priceBtoA.toFixed(4),
    fee: mockPool.fee,
  };

  cache.set(POOL_CACHE_KEY, state, POOL_TTL);
  return state;
}

export function executeSwap(amountIn: number, AtoB: boolean): number {
  cache.clear(POOL_CACHE_KEY);
  const fee = amountIn * 0.003;
  const amountInWithFee = amountIn - fee;

  if (AtoB) {
    const amountOut = (amountInWithFee * mockPool.reserveB) / (mockPool.reserveA + amountInWithFee);
    mockPool.reserveA += amountIn;
    mockPool.reserveB -= amountOut;
    return amountOut;
  } else {
    const amountOut = (amountInWithFee * mockPool.reserveA) / (mockPool.reserveB + amountInWithFee);
    mockPool.reserveB += amountIn;
    mockPool.reserveA -= amountOut;
    return amountOut;
  }
}

export function addLiquidity(amountA: number, amountB: number): number {
  cache.clear(POOL_CACHE_KEY);
  const lpMinted = Math.sqrt(amountA * amountB);
  mockPool.reserveA += amountA;
  mockPool.reserveB += amountB;
  mockPool.totalLiquidity += lpMinted;
  return lpMinted;
}

export function removeLiquidity(lpTokens: number): { amountA: number; amountB: number } {
  cache.clear(POOL_CACHE_KEY);
  const share = lpTokens / mockPool.totalLiquidity;
  const amountA = share * mockPool.reserveA;
  const amountB = share * mockPool.reserveB;
  mockPool.reserveA -= amountA;
  mockPool.reserveB -= amountB;
  mockPool.totalLiquidity -= lpTokens;
  return { amountA, amountB };
}
