// Constant Product AMM: x * y = k
// This mirrors the Soroban liquidity pool contract logic on the frontend

export interface PoolReserves {
  reserveA: number;
  reserveB: number;
}

const FEE = 0.003; // 0.3% fee

export function getAmountOut(
  amountIn: number,
  reserveIn: number,
  reserveOut: number
): number {
  if (amountIn <= 0 || reserveIn <= 0 || reserveOut <= 0) return 0;
  const amountInWithFee = amountIn * (1 - FEE);
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn + amountInWithFee;
  return numerator / denominator;
}

export function getPriceImpact(
  amountIn: number,
  reserveIn: number
): number {
  return (amountIn / (reserveIn + amountIn)) * 100;
}

export function getLpTokensToMint(
  amountA: number,
  amountB: number,
  reserveA: number,
  reserveB: number,
  totalSupply: number
): number {
  if (totalSupply === 0) return Math.sqrt(amountA * amountB);
  return Math.min(
    (amountA / reserveA) * totalSupply,
    (amountB / reserveB) * totalSupply
  );
}

export function getRemoveLiquidityAmounts(
  lpTokens: number,
  totalSupply: number,
  reserveA: number,
  reserveB: number
): { amountA: number; amountB: number } {
  const share = lpTokens / totalSupply;
  return {
    amountA: share * reserveA,
    amountB: share * reserveB,
  };
}

export function getPrice(reserveA: number, reserveB: number): {
  AtoB: number;
  BtoA: number;
} {
  if (reserveA === 0 || reserveB === 0) return { AtoB: 0, BtoA: 0 };
  return {
    AtoB: reserveB / reserveA,
    BtoA: reserveA / reserveB,
  };
}
