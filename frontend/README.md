# ImpactChain Frontend

A modern, responsive frontend for the ImpactChain platform built with Next.js, React, and Tailwind CSS.

## Features

- 🔗 **Wallet Connection**: Seamless integration with MetaMask and other Web3 wallets
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🎨 **Modern UI**: Clean, professional interface with Lucide React icons
- ⚡ **Fast Performance**: Built with Next.js 14 and optimized for speed
- 🔒 **Secure**: RainbowKit integration for secure wallet connections

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, RainbowKit, Viem
- **Icons**: Lucide React
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- WalletConnect Project ID

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Update `.env.local` with your configuration:
   - Get a WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com/)
   - Update contract addresses after deployment
   - Configure RPC URL for Polygon Mumbai

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect Project ID | Yes |
| `NEXT_PUBLIC_IMPACT_TOKEN_ADDRESS` | ImpactToken contract address | Yes |
| `NEXT_PUBLIC_PROJECT_ESCROW_ADDRESS` | ProjectEscrow contract address | Yes |
| `NEXT_PUBLIC_CHAIN_ID` | Target chain ID (80001 for Mumbai) | Yes |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint URL | Yes |

## Project Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Home page
│   └── providers.tsx       # Web3 providers
├── components/             # Reusable components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## Features Overview

### Wallet Connection
- Support for MetaMask, WalletConnect, and other popular wallets
- Automatic network switching to Polygon Mumbai
- Connection status and account information

### Project Management
- View all active and completed projects
- Create new projects (NGOs)
- Donate to projects (Donors)
- Track project progress and milestones

### Impact Tokens
- View earned Impact Tokens
- Display token metadata and impact value
- Transfer and trade tokens

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Development

### Adding New Features

1. Create components in the `components/` directory
2. Add custom hooks in the `hooks/` directory
3. Update types in the `types/` directory
4. Test thoroughly before deployment

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design system defined in `tailwind.config.js`
- Use Lucide React for icons
- Maintain responsive design principles

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions:
- Check the documentation
- Join our Discord community
- Open an issue on GitHub

## License

MIT License - see LICENSE file for details
