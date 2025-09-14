# ImpactChain Deployment Guide

This guide will walk you through deploying the complete ImpactChain system to Polygon Mumbai testnet.

## Prerequisites

### 1. Environment Setup
- Node.js 18+ installed
- Git installed
- MetaMask wallet with Mumbai testnet configured
- Mumbai testnet MATIC tokens (get from [faucet](https://faucet.polygon.technology/))

### 2. Required Accounts & Services
- **Alchemy Account**: Sign up at [alchemy.com](https://www.alchemy.com/) for RPC endpoints
- **WalletConnect Project**: Create at [cloud.walletconnect.com](https://cloud.walletconnect.com/)
- **PolygonScan API Key**: Get from [polygonscan.com](https://polygonscan.com/) for contract verification

## Step 1: Configure Environment Variables

### Backend Configuration

1. Create a `.env` file in the root directory:
```bash
# Network Configuration
POLYGON_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_private_key_here

# Contract Verification
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Optional: Gas optimization
GAS_REPORT=true
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

2. Update `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: process.env.GAS_REPORT === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};
```

### Frontend Configuration

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Create `.env.local`:
```bash
# WalletConnect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Contract addresses (will be updated after deployment)
NEXT_PUBLIC_IMPACT_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_PROJECT_ESCROW_ADDRESS=0x...

# Network configuration
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# Optional: Alchemy API key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
```

## Step 2: Deploy Smart Contracts

### 2.1 Compile Contracts
```bash
# From the root directory
npx hardhat compile
```

### 2.2 Deploy to Mumbai Testnet
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

**Expected Output:**
```
🚀 Starting ImpactChain deployment...
Deploying contracts with account: 0x...
Account balance: 1000000000000000000000

📄 Deploying ImpactToken contract...
✅ ImpactToken deployed to: 0x1234567890abcdef...

🏦 Deploying ProjectEscrow contract...
✅ ProjectEscrow deployed to: 0xabcdef1234567890...

🔗 Verifying contract connection...
✅ Contract connection verified!

📋 Deployment Summary:
Network: mumbai
Chain ID: 80001
Deployer: 0x...
ImpactToken: 0x1234567890abcdef...
ProjectEscrow: 0xabcdef1234567890...

⏳ Waiting for block confirmations...
🔍 Verifying contracts on block explorer...
✅ ImpactToken verified
✅ ProjectEscrow verified

🎉 Deployment completed successfully!
```

### 2.3 Update Frontend Configuration

After successful deployment, update your frontend `.env.local` with the actual contract addresses:

```bash
NEXT_PUBLIC_IMPACT_TOKEN_ADDRESS=0x1234567890abcdef...
NEXT_PUBLIC_PROJECT_ESCROW_ADDRESS=0xabcdef1234567890...
```

## Step 3: Deploy Frontend

### Option A: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy from frontend directory:
```bash
cd frontend
vercel
```

3. Follow the prompts:
   - Link to existing project or create new
   - Set environment variables
   - Deploy

### Option B: Netlify

1. Build the project:
```bash
cd frontend
npm run build
```

2. Deploy the `out` folder to Netlify

### Option C: Manual Deployment

1. Build the project:
```bash
cd frontend
npm run build
```

2. Upload the `out` folder to your hosting provider

## Step 4: Testing the Deployment

### 4.1 Test Smart Contracts

1. Run the test suite:
```bash
npx hardhat test --network mumbai
```

2. Test individual functions using Hardhat console:
```bash
npx hardhat console --network mumbai
```

### 4.2 Test Frontend

1. Visit your deployed frontend URL
2. Connect your wallet (ensure it's on Mumbai testnet)
3. Test the following features:
   - Wallet connection
   - Viewing projects
   - Creating projects (if you have the right permissions)
   - Making donations

## Step 5: Verification & Monitoring

### 5.1 Contract Verification

Contracts are automatically verified during deployment. You can also verify manually:

```bash
npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS "constructor_arg1" "constructor_arg2"
```

### 5.2 Monitor Transactions

- **PolygonScan**: View transactions at [mumbai.polygonscan.com](https://mumbai.polygonscan.com/)
- **Alchemy Dashboard**: Monitor RPC usage and performance
- **Contract Events**: Monitor important events like project creation, donations, etc.

## Step 6: Production Considerations

### 6.1 Security Checklist

- [ ] Private keys are secure and not committed to version control
- [ ] Environment variables are properly configured
- [ ] Contracts are verified on block explorer
- [ ] Access controls are properly implemented
- [ ] Emergency functions are tested

### 6.2 Performance Optimization

- [ ] Gas optimization enabled in Solidity compiler
- [ ] Frontend is optimized for production
- [ ] CDN is configured for static assets
- [ ] Database indexing is optimized (if applicable)

### 6.3 Monitoring Setup

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up transaction monitoring
- [ ] Create alerts for critical events

## Troubleshooting

### Common Issues

1. **"Insufficient funds" error**
   - Ensure you have enough MATIC tokens
   - Get testnet tokens from [faucet](https://faucet.polygon.technology/)

2. **"Network not supported" error**
   - Add Mumbai testnet to MetaMask:
     - Network Name: Mumbai Testnet
     - RPC URL: https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
     - Chain ID: 80001
     - Currency Symbol: MATIC
     - Block Explorer: https://mumbai.polygonscan.com/

3. **Contract verification fails**
   - Check constructor arguments
   - Ensure contract is deployed successfully
   - Verify API key is correct

4. **Frontend connection issues**
   - Check WalletConnect Project ID
   - Verify contract addresses
   - Ensure RPC URL is accessible

### Getting Help

- Check the [Hardhat documentation](https://hardhat.org/docs)
- Visit [Polygon documentation](https://docs.polygon.technology/)
- Join our Discord community
- Open an issue on GitHub

## Next Steps

After successful deployment:

1. **Create Sample Data**: Deploy some test projects and donations
2. **User Testing**: Have NGOs and donors test the platform
3. **Feedback Collection**: Gather user feedback and iterate
4. **Mainnet Deployment**: Plan migration to Polygon mainnet
5. **Marketing**: Promote the platform to NGOs and donors

## Support

For deployment support:
- 📧 Email: support@impactchain.org
- 💬 Discord: [Join our community](https://discord.gg/impactchain)
- 📖 Documentation: [docs.impactchain.org](https://docs.impactchain.org)
- 🐛 Issues: [GitHub Issues](https://github.com/impactchain/issues)

---

**Congratulations!** 🎉 You've successfully deployed ImpactChain to Polygon Mumbai testnet. The platform is now ready for testing and development.
