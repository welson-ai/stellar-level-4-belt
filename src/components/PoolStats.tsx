'use client';
import { PoolState } from '@/types';
import LoadingSpinner from './LoadingSpinner';

export default function PoolStats({ poolState }: { poolState: PoolState | null }) {
  if (!poolState) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl border border-purple-600/20 p-4 animate-pulse relative overflow-hidden">
            <div className="h-4 bg-purple-800/30 rounded mb-2"></div>
            <div className="h-6 bg-purple-800/30 rounded"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-pink-400/30 rounded-full animate-ping"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalLiquidity = (Number(poolState.reserveA) + Number(poolState.reserveB)).toFixed(2);

  const stats = [
    {
      icon: '💧',
      label: 'Total Liquidity',
      value: `${totalLiquidity}`,
      suffix: '',
      gradient: 'from-blue-500/20 to-purple-500/20',
      borderColor: 'border-blue-600/30',
    },
    {
      icon: '🌟',
      label: 'STLR Price',
      value: poolState.priceAtoB,
      suffix: 'USDC',
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-600/30',
    },
    {
      icon: '✨',
      label: 'USDC Price',
      value: poolState.priceBtoA,
      suffix: 'STLR',
      gradient: 'from-pink-500/20 to-purple-500/20',
      borderColor: 'border-pink-600/30',
    },
    {
      icon: '🎀',
      label: 'Pool Fee',
      value: poolState.fee,
      suffix: '%',
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-600/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-sm rounded-2xl border ${stat.borderColor} p-4 transform hover:scale-105 transition-all duration-300 relative overflow-hidden group cursor-pointer`}
        >
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-white/10 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/10 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity delay-100"></div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl filter drop-shadow-sm animate-bounce">{stat.icon}</span>
            <span className="text-purple-200 text-sm font-medium">{stat.label}</span>
          </div>
          <div className="text-white font-bold text-xl">
            {stat.value}
            {stat.suffix && <span className="text-purple-300 text-sm ml-1 font-normal">{stat.suffix}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
