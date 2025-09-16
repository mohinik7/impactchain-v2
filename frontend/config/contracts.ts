// Contract addresses and network configuration
export const contractConfig = {
  addresses: {
    impactToken: process.env.NEXT_PUBLIC_IMPACT_TOKEN_ADDRESS,
    projectEscrow: process.env.NEXT_PUBLIC_PROJECT_ESCROW_ADDRESS,
  },
  network: {
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 31337,
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545',
  },
};