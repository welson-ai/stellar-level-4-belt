export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance?: string;
}

export interface PoolState {
  reserveA: string;
  reserveB: string;
  totalLiquidity: string;
  priceAtoB: string;
  priceBtoA: string;
  fee: string;
}

export interface SwapParams {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  minAmountOut: string;
  slippage: number;
}

export interface LiquidityParams {
  amountA: string;
  amountB: string;
  minLpTokens: string;
}

export interface WalletState {
  address: string;
  isConnected: boolean;
  network: string;
  balanceA: string;
  balanceB: string;
  lpBalance: string;
}

export interface SwapEvent {
  id: string;
  type: 'swap' | 'add_liquidity' | 'remove_liquidity';
  from: string;
  amountIn: string;
  amountOut: string;
  tokenIn: string;
  tokenOut: string;
  timestamp: string;
  hash: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
