'use client';
import { useState } from 'react';
import { PoolState, WalletState } from '@/types';
import LoadingSpinner from './LoadingSpinner';

export default function SwapCard({ 
  poolState, 
  walletState, 
  onSwap, 
  isLoading, 
  amountOut, 
  priceImpact, 
  onCalculate 
}: {
  poolState: PoolState | null;
  walletState: WalletState;
  onSwap: (amountIn: number, AtoB: boolean, address: string) => Promise<number>;
  isLoading: boolean;
  amountOut: string;
  priceImpact: string;
  onCalculate: (amountIn: string, AtoB: boolean) => void;
}) {
  const [amountIn, setAmountIn] = useState('');
  const [AtoB, setAtoB] = useState(true);
  const [slippage, setSlippage] = useState('1');

  const handleAmountChange = (value: string) => {
    setAmountIn(value);
    onCalculate(value, AtoB);
  };

  const handleSwap = async () => {
    if (!amountIn || !poolState || !walletState.address) return;
    
    try {
      await onSwap(Number(amountIn), AtoB, walletState.address);
      setAmountIn('');
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  const toggleDirection = () => {
    setAtoB(!AtoB);
    onCalculate(amountIn, !AtoB);
  };

  const maxBalance = AtoB ? walletState.balanceA : walletState.balanceB;

  const getPriceImpactColor = () => {
    const impact = Number(priceImpact);
    if (impact > 5) return 'text-red-400';
    if (impact > 1) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl border border-purple-600/30 p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-pink-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-3xl animate-bounce">🔄</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Swap</span>
        </h2>

        {/* Token A Input */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200 text-sm font-medium">From</span>
            <button
              onClick={() => handleAmountChange(maxBalance)}
              className="text-pink-300 hover:text-pink-200 text-sm font-medium transform hover:scale-105 transition-all"
            >
              ✨ MAX: {maxBalance}
            </button>
          </div>
          <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-purple-600/20">
            <input
              type="number"
              value={amountIn}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-white text-lg flex-1 outline-none placeholder-purple-400"
            />
            <span className="text-purple-200 font-bold text-lg">{AtoB ? 'STLR' : 'USDC'}</span>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center my-6">
          <button
            onClick={toggleDirection}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full p-3 transition-all transform hover:scale-110 shadow-lg group"
          >
            <span className="text-2xl filter drop-shadow-sm group-hover:animate-spin">↕️</span>
          </button>
        </div>

        {/* Token B Output */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200 text-sm font-medium">To</span>
          </div>
          <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-purple-600/20">
            <span className="text-white text-lg font-bold">{amountOut}</span>
            <span className="text-purple-200 font-bold text-lg">{AtoB ? 'USDC' : 'STLR'}</span>
          </div>
        </div>

        {/* Price Impact */}
        {amountIn && Number(priceImpact) > 0 && (
          <div className={`mb-4 text-sm font-medium flex items-center gap-2 p-3 rounded-xl backdrop-blur-sm ${
            Number(priceImpact) > 5 
              ? 'bg-red-900/40 text-red-200 border border-red-600/30' 
              : Number(priceImpact) > 1 
              ? 'bg-yellow-900/40 text-yellow-200 border border-yellow-600/30'
              : 'bg-green-900/40 text-green-200 border border-green-600/30'
          }`}>
            <span className="text-lg">🌸</span>
            <span>Price Impact: {priceImpact}%</span>
          </div>
        )}

        {/* Slippage Tolerance */}
        <div className="mb-6">
          <span className="text-purple-200 text-sm font-medium block mb-3">🎀 Slippage Tolerance</span>
          <div className="flex gap-3">
            {['0.5', '1', '2'].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                  slippage === value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30 border border-purple-600/20'
                }`}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!amountIn || isLoading || !walletState.isConnected}
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-400 hover:via-pink-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="relative z-10">Swapping... ✨</span>
            </>
          ) : (
            <>
              <span className="text-xl relative z-10">🌟</span>
              <span className="relative z-10">Swap Tokens</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
