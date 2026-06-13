'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { fallback, http } from 'viem';
import { arbitrum, arbitrumSepolia, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';
import { RPC_URLS } from './contract';

// Robinhood Chain Testnet (custom chain — not in wagmi defaults)
const robinhoodChainTestnet = defineChain({
  id: 46630,
  name: 'Robinhood Chain Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.chain.robinhood.com'] },
    public: { http: ['https://rpc.testnet.chain.robinhood.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Robinhood Explorer',
      url: 'https://explorer.testnet.chain.robinhood.com',
    },
  },
  testnet: true,
});

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();
const hasWalletConnectProjectId = Boolean(
  walletConnectProjectId && !/^0+$/.test(walletConnectProjectId)
);

const popularWallets = [
  metaMaskWallet,
  coinbaseWallet,
  rabbyWallet,
  ...(hasWalletConnectProjectId ? [rainbowWallet, walletConnectWallet] : []),
];

// Active chain ID from env — default Arbitrum Sepolia
const activeChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '421614');

const allChains = [arbitrumSepolia, robinhoodChainTestnet, arbitrum, sepolia] as const;

export const wagmiConfig = getDefaultConfig({
  appName: 'Arbitrum Agent Kit',
  projectId: walletConnectProjectId || 'arbitrum-agent-kit',
  chains: allChains,
  transports: {
    [arbitrumSepolia.id]: fallback(RPC_URLS.map((url) => http(url))),
    [robinhoodChainTestnet.id]: http('https://rpc.testnet.chain.robinhood.com'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [sepolia.id]: http('https://rpc.ankr.com/eth_sepolia'),
  },
  wallets: [
    {
      groupName: 'Popular',
      wallets: popularWallets,
    },
  ],
  ssr: true,
});

export { robinhoodChainTestnet };
export { activeChainId };
