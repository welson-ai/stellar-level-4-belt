'use client';
import { useState, useEffect } from 'react';
import { PoolState, SwapEvent } from '@/types';
import { getPoolState, executeSwap, addLiquidity, removeLiquidity } from '@/lib/pool';
import { getAmountOut, getPriceImpact } from '@/lib/amm';

export function useDex() {
  const [poolState, setPoolState] = useState<PoolState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<SwapEvent[]>([]);
  const [amountOut, setAmountOut] = useState('0.00');
  const [priceImpact, setPriceImpact] = useState('0.00');

  const refreshPool = async () => {
    setIsLoading(true);
    try {
      const state = await getPoolState();
      setPoolState(state);
    } catch {
      setError('Failed to fetch pool state');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSwap = (amountIn: string, AtoB: boolean) => {
    if (!poolState || !amountIn || isNaN(Number(amountIn))) {
      setAmountOut('0.00');
      setPriceImpact('0.00');
      return;
    }
    const reserveIn = AtoB ? Number(poolState.reserveA) : Number(poolState.reserveB);
    const reserveOut = AtoB ? Number(poolState.reserveB) : Number(poolState.reserveA);
    const out = getAmountOut(Number(amountIn), reserveIn, reserveOut);
    const impact = getPriceImpact(Number(amountIn), reserveIn);
    setAmountOut(out.toFixed(4));
    setPriceImpact(impact.toFixed(2));
  };

  const handleSwap = async (amountIn: number, AtoB: boolean, address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const out = executeSwap(amountIn, AtoB);
      const event: SwapEvent = {
        id: Date.now().toString(),
        type: 'swap',
        from: address,
        amountIn: amountIn.toFixed(4),
        amountOut: out.toFixed(4),
        tokenIn: AtoB ? 'STLR' : 'USDC',
        tokenOut: AtoB ? 'USDC' : 'STLR',
        timestamp: new Date().toLocaleTimeString(),
        hash: `0x${Math.random().toString(16).slice(2, 10)}`,
      };
      setEvents(prev => [event, ...prev].slice(0, 20));
      await refreshPool();
      return out;
    } catch (e: any) {
      setError(e.message || 'Swap failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLiquidity = async (amountA: number, amountB: number, address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const lp = addLiquidity(amountA, amountB);
      const event: SwapEvent = {
        id: Date.now().toString(),
        type: 'add_liquidity',
        from: address,
        amountIn: `${amountA} STLR + ${amountB} USDC`,
        amountOut: `${lp.toFixed(4)} LP`,
        tokenIn: 'STLR+USDC',
        tokenOut: 'LP',
        timestamp: new Date().toLocaleTimeString(),
        hash: `0x${Math.random().toString(16).slice(2, 10)}`,
      };
      setEvents(prev => [event, ...prev].slice(0, 20));
      await refreshPool();
      return lp;
    } catch (e: any) {
      setError(e.message || 'Add liquidity failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLiquidity = async (lpTokens: number, address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { amountA, amountB } = removeLiquidity(lpTokens);
      const event: SwapEvent = {
        id: Date.now().toString(),
        type: 'remove_liquidity',
        from: address,
        amountIn: `${lpTokens} LP`,
        amountOut: `${amountA.toFixed(4)} STLR + ${amountB.toFixed(4)} USDC`,
        tokenIn: 'LP',
        tokenOut: 'STLR+USDC',
        timestamp: new Date().toLocaleTimeString(),
        hash: `0x${Math.random().toString(16).slice(2, 10)}`,
      };
      setEvents(prev => [event, ...prev].slice(0, 20));
      await refreshPool();
      return { amountA, amountB };
    } catch (e: any) {
      setError(e.message || 'Remove liquidity failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPool();
    const interval = setInterval(refreshPool, 15000);
    return () => clearInterval(interval);
  }, []);

  return {
    poolState,
    isLoading,
    error,
    events,
    amountOut,
    priceImpact,
    calculateSwap,
    handleSwap,
    handleAddLiquidity,
    handleRemoveLiquidity,
    refreshPool,
  };
}
