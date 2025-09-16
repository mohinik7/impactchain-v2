# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

```
Impact_Chain_V2
├─ contracts
│  ├─ ImpactToken.sol
│  └─ ProjectEscrow.sol
├─ day2.md
├─ day3.md
├─ DEPLOYMENT_GUIDE.md
├─ frontend
│  ├─ app
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ projects
│  │  │  ├─ page.tsx
│  │  │  └─ [projectId]
│  │  │     └─ donate
│  │  │        └─ page.tsx
│  │  └─ providers.tsx
│  ├─ components
│  │  ├─ DonationPage.tsx
│  │  ├─ NGOdiscovery.tsx
│  │  ├─ ProjectManager.tsx
│  │  └─ TestComponent.tsx
│  ├─ config
│  │  └─ contracts.ts
│  ├─ contexts
│  │  └─ web3Context.tsx
│  ├─ env.example
│  ├─ hooks
│  │  ├─ useContracts.ts
│  │  ├─ useProjects.ts
│  │  └─ useProjects.ts.bak
│  ├─ lib
│  │  └─ contracts.ts
│  ├─ next-env.d.ts
│  ├─ next.config.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ README.md
│  ├─ services
│  │  └─ contractService.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  └─ types
│     └─ window.d.ts
├─ hardhat.config.js
├─ ignition
│  └─ modules
│     └─ Lock.js
├─ IMPLEMENTATION_SUMMARY.md
├─ package-lock.json
├─ package.json
├─ README.md
├─ scripts
│  ├─ create-test-project.js
│  └─ deploy.js
└─ test
   └─ ProjectEscrow.test.js

```
