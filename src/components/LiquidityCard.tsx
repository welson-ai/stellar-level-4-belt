'use client';
import { useState } from 'react';
import { PoolState, WalletState } from '@/types';
import LoadingSpinner from './LoadingSpinner';

export default function LiquidityCard({ 
  poolState, 
  walletState, 
  onAdd, 
  onRemove, 
  isLoading 
}: {
  poolState: PoolState | null;
  walletState: WalletState;
  onAdd: (amountA: number, amountB: number, address: string) => Promise<number>;
  onRemove: (lpTokens: number, address: string) => Promise<{ amountA: number; amountB: number }>;
  isLoading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [lpTokens, setLpTokens] = useState('');

  // Calculate amount B based on pool ratio when amount A changes
  const handleAmountAChange = (value: string) => {
    setAmountA(value);
    if (poolState && value) {
      const ratio = Number(poolState.reserveB) / Number(poolState.reserveA);
      setAmountB((Number(value) * ratio).toFixed(4));
    } else {
      setAmountB('');
    }
  };

  // Calculate amount A based on pool ratio when amount B changes
  const handleAmountBChange = (value: string) => {
    setAmountB(value);
    if (poolState && value) {
      const ratio = Number(poolState.reserveA) / Number(poolState.reserveB);
      setAmountA((Number(value) * ratio).toFixed(4));
    } else {
      setAmountA('');
    }
  };

  // Estimate LP tokens for add liquidity
  const getEstimatedLpTokens = () => {
    if (!poolState || !amountA || !amountB) return '0.00';
    const totalLiquidity = Number(poolState.totalLiquidity);
    if (totalLiquidity === 0) {
      return (Math.sqrt(Number(amountA) * Number(amountB))).toFixed(4);
    }
    const reserveA = Number(poolState.reserveA);
    const reserveB = Number(poolState.reserveB);
    const lpFromA = (Number(amountA) / reserveA) * totalLiquidity;
    const lpFromB = (Number(amountB) / reserveB) * totalLiquidity;
    return Math.min(lpFromA, lpFromB).toFixed(4);
  };

  // Estimate tokens for remove liquidity
  const getEstimatedRemoveAmounts = () => {
    if (!poolState || !lpTokens) return { amountA: '0.00', amountB: '0.00' };
    const totalLiquidity = Number(poolState.totalLiquidity);
    const share = Number(lpTokens) / totalLiquidity;
    return {
      amountA: (share * Number(poolState.reserveA)).toFixed(4),
      amountB: (share * Number(poolState.reserveB)).toFixed(4),
    };
  };

  const handleAddLiquidity = async () => {
    if (!amountA || !amountB || !walletState.address) return;
    try {
      await onAdd(Number(amountA), Number(amountB), walletState.address);
      setAmountA('');
      setAmountB('');
    } catch (error) {
      console.error('Add liquidity failed:', error);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!lpTokens || !walletState.address) return;
    try {
      await onRemove(Number(lpTokens), walletState.address);
      setLpTokens('');
    } catch (error) {
      console.error('Remove liquidity failed:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl border border-purple-600/30 p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-pink-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-3xl animate-bounce">💧</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Liquidity Pool</span>
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30 border border-purple-600/20'
            }`}
          >
            ✨ Add
          </button>
          <button
            onClick={() => setActiveTab('remove')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
              activeTab === 'remove'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30 border border-purple-600/20'
            }`}
          >
            🌙 Remove
          </button>
        </div>

        {activeTab === 'add' ? (
          <div className="space-y-4">
            {/* STLR Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-purple-200 text-sm font-medium">🌟 STLR Amount</span>
                <button
                  onClick={() => handleAmountAChange(walletState.balanceA)}
                  className="text-pink-300 hover:text-pink-200 text-sm font-medium transform hover:scale-105 transition-all"
                >
                  ✨ MAX: {walletState.balanceA}
                </button>
              </div>
              <input
                type="number"
                value={amountA}
                onChange={(e) => handleAmountAChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-2xl p-4 text-white outline-none border border-purple-600/20 placeholder-purple-400"
              />
            </div>

            {/* USDC Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-purple-200 text-sm font-medium">💎 USDC Amount</span>
                <button
                  onClick={() => handleAmountBChange(walletState.balanceB)}
                  className="text-pink-300 hover:text-pink-200 text-sm font-medium transform hover:scale-105 transition-all"
                >
                  ✨ MAX: {walletState.balanceB}
                </button>
              </div>
              <input
                type="number"
                value={amountB}
                onChange={(e) => handleAmountBChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-2xl p-4 text-white outline-none border border-purple-600/20 placeholder-purple-400"
              />
            </div>

            {/* Estimated LP Tokens */}
            {amountA && amountB && (
              <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-600/20">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌸</span>
                  <span className="text-purple-200 text-sm font-medium">Estimated LP Tokens:</span>
                  <span className="text-white font-bold text-lg">{getEstimatedLpTokens()}</span>
                </div>
              </div>
            )}

            {/* Add Liquidity Button */}
            <button
              onClick={handleAddLiquidity}
              disabled={!amountA || !amountB || isLoading || !walletState.isConnected}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-400 hover:via-pink-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="relative z-10">Adding... ✨</span>
                </>
              ) : (
                <>
                  <span className="text-xl relative z-10">💧</span>
                  <span className="relative z-10">Add Liquidity</span>
                </>
              )}
            </button>
          </div>
      ) : (
          <div className="space-y-4">
            {/* LP Tokens Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-purple-200 text-sm font-medium">🎀 LP Tokens</span>
                <button
                  onClick={() => setLpTokens(walletState.lpBalance)}
                  className="text-pink-300 hover:text-pink-200 text-sm font-medium transform hover:scale-105 transition-all"
                >
                  ✨ MAX: {walletState.lpBalance}
                </button>
              </div>
              <input
                type="number"
                value={lpTokens}
                onChange={(e) => setLpTokens(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-2xl p-4 text-white outline-none border border-purple-600/20 placeholder-purple-400"
              />
            </div>

            {/* Estimated Returns */}
            {lpTokens && (
              <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-2xl p-4 space-y-3 border border-purple-600/20">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm font-medium">🌟 STLR to receive:</span>
                  <span className="text-white font-bold">{getEstimatedRemoveAmounts().amountA}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm font-medium">💎 USDC to receive:</span>
                  <span className="text-white font-bold">{getEstimatedRemoveAmounts().amountB}</span>
                </div>
              </div>
            )}

            {/* Remove Liquidity Button */}
            <button
              onClick={handleRemoveLiquidity}
              disabled={!lpTokens || isLoading || !walletState.isConnected}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-400 hover:via-pink-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="relative z-10">Removing... 🌙</span>
                </>
              ) : (
                <>
                  <span className="text-xl relative z-10">🔥</span>
                  <span className="relative z-10">Remove Liquidity</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
