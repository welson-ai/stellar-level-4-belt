'use client';
import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useDex } from '@/hooks/useDex';
import WalletConnect from '@/components/WalletConnect';
import PoolStats from '@/components/PoolStats';
import SwapCard from '@/components/SwapCard';
import LiquidityCard from '@/components/LiquidityCard';
import LiveFeed from '@/components/LiveFeed';
import LoadingSpinner from '@/components/LoadingSpinner';

type Tab = 'swap' | 'pool' | 'activity';

export default function Home() {
  const wallet = useWallet();
  const dex = useDex();
  const [activeTab, setActiveTab] = useState<Tab>('swap');

  const tabs = [
    { id: 'swap' as Tab, label: 'Swap', icon: '🔄' },
    { id: 'pool' as Tab, label: 'Pool', icon: '💧' },
    { id: 'activity' as Tab, label: 'Activity', icon: '⚡' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-purple-800/30 bg-purple-950/80 backdrop-blur-lg px-4 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-3xl animate-bounce">🌊</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
          </div>
          <div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              StellarSwap
            </span>
            <div className="text-xs text-purple-300 hidden sm:block">✨ Your cute DEX on Stellar</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {wallet.walletState.isConnected ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1 text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-600/50 px-3 py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="font-medium">TESTNET</span>
              </span>
              <div className="hidden sm:block text-xs bg-purple-800/30 border border-purple-600/30 px-3 py-1.5 rounded-lg">
                <span className="text-purple-300">{wallet.walletState.address.slice(0, 6)}</span>
                <span className="text-purple-400 mx-1">...</span>
                <span className="text-purple-300">{wallet.walletState.address.slice(-4)}</span>
              </div>
              <button
                onClick={wallet.disconnectWallet}
                className="text-xs text-purple-300 hover:text-pink-300 border border-purple-600/30 hover:border-pink-600/30 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              >
                🌙 Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={wallet.connectWallet}
              disabled={wallet.isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-700 text-white text-sm px-5 py-2.5 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {wallet.isLoading ? <LoadingSpinner size="sm" /> : '🔗'}
              <span className="font-medium">Connect</span>
            </button>
          )}
        </div>
      </header>

      {/* Error Banner */}
      {(wallet.error || dex.error) && (
        <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-red-900/60 to-pink-900/60 border border-red-600/50 rounded-xl text-red-200 text-sm shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌸</span>
            <span>{wallet.error || dex.error}</span>
          </div>
        </div>
      )}

      {!wallet.walletState.isConnected ? (
        <div className="flex items-center justify-center min-h-[85vh] px-4 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="text-9xl animate-pulse">🌸</div>
          </div>
          <div className="relative z-10">
            <WalletConnect
              onConnect={wallet.connectWallet}
              isLoading={wallet.isLoading}
              error={wallet.error}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Pool Stats Bar */}
          <div className="max-w-6xl mx-auto px-4 pt-8">
            <PoolStats poolState={dex.poolState} />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 py-8">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <SwapCard
                poolState={dex.poolState}
                walletState={wallet.walletState}
                onSwap={dex.handleSwap}
                isLoading={dex.isLoading}
                amountOut={dex.amountOut}
                priceImpact={dex.priceImpact}
                onCalculate={dex.calculateSwap}
              />
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <LiquidityCard
                poolState={dex.poolState}
                walletState={wallet.walletState}
                onAdd={dex.handleAddLiquidity}
                onRemove={dex.handleRemoveLiquidity}
                isLoading={dex.isLoading}
              />
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <LiveFeed events={dex.events} />
            </div>
          </div>

          {/* Mobile Tab Layout */}
          <div className="lg:hidden">
            <div className="px-4 py-6 pb-28">
              <div className="transform transition-all duration-300">
                {activeTab === 'swap' && (
                  <SwapCard
                    poolState={dex.poolState}
                    walletState={wallet.walletState}
                    onSwap={dex.handleSwap}
                    isLoading={dex.isLoading}
                    amountOut={dex.amountOut}
                    priceImpact={dex.priceImpact}
                    onCalculate={dex.calculateSwap}
                  />
                )}
                {activeTab === 'pool' && (
                  <LiquidityCard
                    poolState={dex.poolState}
                    walletState={wallet.walletState}
                    onAdd={dex.handleAddLiquidity}
                    onRemove={dex.handleRemoveLiquidity}
                    isLoading={dex.isLoading}
                  />
                )}
                {activeTab === 'activity' && (
                  <LiveFeed events={dex.events} />
                )}
              </div>
            </div>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-950/95 to-purple-900/95 backdrop-blur-xl border-t border-purple-800/30 px-4 py-3 flex justify-around z-50 shadow-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-2 px-6 py-3 rounded-2xl transition-all transform hover:scale-110 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-300 hover:text-white hover:bg-purple-800/30'
                  }`}
                >
                  <span className="text-2xl filter drop-shadow-sm">{tab.icon}</span>
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </main>
  );
}
