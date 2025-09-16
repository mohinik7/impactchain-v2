'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain, http } from 'viem'
import { useState } from 'react'
import { Web3Provider } from '../contexts/web3Context'

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css'

// Define local Hardhat network
const hardhatNetwork = defineChain({
  id: 31337,
  name: 'Hardhat Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { 
      http: ['http://127.0.0.1:8545'],
    },
    public: { 
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Local Explorer', url: 'http://localhost:8545' },
  },
})

const wagmiConfig = getDefaultConfig({
  appName: 'ImpactChain',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [hardhatNetwork],
  transports: {
    [hardhatNetwork.id]: http('http://127.0.0.1:8545'),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3Provider>
            {children}
          </Web3Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}