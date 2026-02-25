'use client';
import LoadingSpinner from './LoadingSpinner';

export default function WalletConnect({ onConnect, isLoading, error }: { 
  onConnect: () => void; 
  isLoading: boolean; 
  error: string | null;
}) {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl border border-purple-600/30 p-8 text-center shadow-2xl relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 w-8 h-8 bg-pink-400/20 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute top-8 right-6 w-6 h-6 bg-purple-400/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-8 left-8 w-10 h-10 bg-blue-400/20 rounded-full blur-lg animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <div className="relative inline-block mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              🌊 StellarSwap
            </h1>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
          </div>
          <p className="text-purple-200 text-lg font-medium">✨ Your cute DEX on Stellar</p>
          <div className="mt-2 text-purple-300 text-sm">🌸 Swap tokens with love 💕</div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <span className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 rounded-full text-sm border border-purple-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
            ⚡ Instant Swaps
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-200 rounded-full text-sm border border-blue-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
            💧 Earn Fees
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-green-600/30 to-emerald-600/30 text-green-200 rounded-full text-sm border border-green-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
            🔒 Safe & Secure
          </span>
        </div>

        <button
          onClick={onConnect}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-400 hover:via-pink-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-5 px-8 rounded-2xl transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="relative z-10">Connecting... 🌸</span>
            </>
          ) : (
            <>
              <span className="text-xl relative z-10">🔗</span>
              <span className="relative z-10">Connect Freighter Wallet</span>
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-900/60 to-pink-900/60 border border-red-600/50 rounded-xl text-red-200 text-sm shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌸</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-purple-300 text-sm mb-3">🌙 Don't have Freighter?</p>
          <a
            href="https://freighter.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-200 hover:text-pink-200 underline text-sm font-medium transition-colors transform hover:scale-105"
          >
            <span>🚀</span>
            <span>Install Freighter Wallet</span>
          </a>
        </div>

        {/* Cute Footer */}
        <div className="mt-8 text-center">
          <div className="text-purple-400 text-xs animate-pulse">
            Made with 💕 on Stellar
          </div>
        </div>
      </div>
    </div>
  );
}
