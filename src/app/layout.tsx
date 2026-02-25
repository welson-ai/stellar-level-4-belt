import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StellarSwap | DEX on Stellar',
  description: 'Decentralized exchange built on Stellar blockchain',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
