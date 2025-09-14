'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'
import { http } from 'viem'
import { useState } from 'react'

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css'

// Define local Hardhat network
const hardhatNetwork = defineChain({
  id: 31337,
  name: 'Hardhat Localnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hardhat Explorer',
      url: 'http://localhost:8545',
    },
  },
})

// Configure chains
const config = getDefaultConfig({
  appName: 'ImpactChain',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [hardhatNetwork],
  transports: {
    [hardhatNetwork.id]: http('http://127.0.0.1:8545'),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
