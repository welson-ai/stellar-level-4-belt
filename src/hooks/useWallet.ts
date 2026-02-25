'use client';
import { useState, useCallback } from 'react';
import freighter from '@stellar/freighter-api';
import { WalletState } from '@/types';
import { getBalance, fundTestAccount } from '@/lib/stellar';

const defaultState: WalletState = {
  address: '',
  isConnected: false,
  network: '',
  balanceA: '1000.00',
  balanceB: '500.00',
  lpBalance: '0.00',
};

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>(defaultState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { isConnected } = await freighter.isConnected();
      if (!isConnected) throw new Error('Freighter not found. Please install it at freighter.app');

      const { address } = await freighter.getAddress();
      if (!address) throw new Error('Could not get wallet address. Make sure Freighter is unlocked.');

      setWalletState(prev => ({
        ...prev,
        address,
        isConnected: true,
        network: 'TESTNET',
      }));
    } catch (e: any) {
      setError(e.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletState(defaultState);
    setError(null);
  };

  const fundAccount = async () => {
    if (!walletState.address) return;
    setIsLoading(true);
    try {
      await fundTestAccount(walletState.address);
    } catch {
      setError('Friendbot funding failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalances = useCallback((balanceA: string, balanceB: string, lpBalance: string) => {
    setWalletState(prev => ({ ...prev, balanceA, balanceB, lpBalance }));
  }, []);

  return {
    walletState,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    fundAccount,
    updateBalances,
  };
}
