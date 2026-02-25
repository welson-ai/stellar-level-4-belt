import * as StellarSdk from '@stellar/stellar-sdk';

export const server = new StellarSdk.Horizon.Server(
  process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org'
);

export const networkPassphrase = StellarSdk.Networks.TESTNET;

export function isValidAddress(address: string): boolean {
  try {
    StellarSdk.Keypair.fromPublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getBalance(address: string): Promise<string> {
  try {
    const account = await server.loadAccount(address);
    const xlm = account.balances.find((b: any) => b.asset_type === 'native');
    return xlm ? parseFloat(xlm.balance).toFixed(2) : '0.00';
  } catch {
    return '0.00';
  }
}

export async function fundTestAccount(address: string): Promise<void> {
  await fetch(`https://friendbot.stellar.org?addr=${address}`);
}
