'use client';
import { SwapEvent } from '@/types';

export default function LiveFeed({ events }: { events: SwapEvent[] }) {
  const getEventIcon = (type: SwapEvent['type']) => {
    switch (type) {
      case 'swap': return '🔄';
      case 'add_liquidity': return '💧';
      case 'remove_liquidity': return '🔥';
      default: return '⚡';
    }
  };

  const getEventText = (event: SwapEvent) => {
    switch (event.type) {
      case 'swap':
        return `Swapped ${event.amountIn} ${event.tokenIn} → ${event.amountOut} ${event.tokenOut}`;
      case 'add_liquidity':
        return `Added liquidity: ${event.amountOut} LP minted`;
      case 'remove_liquidity':
        return `Removed liquidity: ${event.amountIn} LP burned`;
      default:
        return 'Unknown event';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl border border-purple-600/30 p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-pink-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl animate-bounce">⚡</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Live Activity</h2>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></span>
            <span className="h-3 w-3 bg-pink-400 rounded-full animate-ping"></span>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-pulse">🌸</div>
            <div className="text-purple-300 text-sm font-medium">No activity yet.</div>
            <div className="text-purple-400 text-sm mt-2">✨ Make the first swap!</div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-600/20 transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Decorative element */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-white/10 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl filter drop-shadow-sm animate-bounce">{getEventIcon(event.type)}</span>
                    <span className="text-white text-sm font-medium">{getEventText(event)}</span>
                  </div>
                  <span className="text-purple-300 text-xs font-medium">{event.timestamp}</span>
                </div>
                <div className="text-purple-400 text-xs font-medium mb-1">
                  🌸 {event.from.slice(0, 6)}...{event.from.slice(-4)}
                </div>
                <div className="text-purple-500 text-xs font-mono">
                  🔗 {event.hash}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Cute footer */}
        <div className="mt-6 text-center">
          <div className="text-purple-400 text-xs animate-pulse">
            💕 Real-time updates
          </div>
        </div>
      </div>
    </div>
  );
}
