# Deployment Guide

Complete deployment documentation for the Literature Review System smart contract on Ethereum Sepolia testnet.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Compilation](#compilation)
- [Deployment](#deployment)
- [Contract Verification](#contract-verification)
- [Interaction](#interaction)
- [Simulation](#simulation)
- [Network Information](#network-information)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the Literature Review System, ensure you have:

- **Node.js**: Version 18.0.0 or higher
- **npm** or **yarn**: Package manager
- **MetaMask**: Browser wallet for managing accounts
- **Sepolia ETH**: Test tokens for deployment (get from faucet)
- **Infura/Alchemy Account**: RPC provider (optional but recommended)
- **Etherscan Account**: For contract verification (optional)

## Environment Setup

### 1. Navigate to Project Directory

```bash
cd /path/to/literature-review-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Required: Your wallet private key
PRIVATE_KEY=your_wallet_private_key_here

# Required: RPC URL (choose one option)
INFURA_PROJECT_ID=your_infura_project_id_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id_here

# Optional: For contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 4. Get Sepolia Test ETH

Obtain test ETH from Sepolia faucets:

- **Alchemy Faucet**: https://sepoliafaucet.com/
- **Infura Faucet**: https://www.infura.io/faucet/sepolia
- **Chainlink Faucet**: https://faucets.chain.link/sepolia
- **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia

**Recommended amount**: At least 0.1 Sepolia ETH for deployment and testing

## Installation

### Install Project Dependencies

```bash
npm install
```

This will install:
- Hardhat framework
- Ethers.js library
- FHEVM Solidity library
- Contract verification tools
- Testing utilities

## Compilation

### Compile Smart Contracts

```bash
npm run compile
```

Or using Hardhat directly:

```bash
npx hardhat compile
```

**Expected Output**:
```
Compiled 1 Solidity file successfully
```

**Artifacts Location**:
- Compiled contracts: `./artifacts/contracts/`
- ABI files: `./artifacts/contracts/LiteratureReviewSystem.sol/LiteratureReviewSystem.json`

### Clean Build Artifacts (if needed)

```bash
npm run clean
```

## Deployment

### Deploy to Sepolia Testnet

**Method 1: Using npm script**
```bash
npm run deploy
```

**Method 2: Using Hardhat directly**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Deployment Output

```
=================================================
Literature Review System - Deployment Script
=================================================

Deploying contracts with account: 0x1234...5678
Account balance: 0.5 ETH

Network: sepolia
Chain ID: 11155111
=================================================

Deploying LiteratureReviewSystem contract...

✅ Contract deployed successfully!
=================================================
Contract Address: 0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0
Deployment time: 45.23 seconds
=================================================

Transaction Details:
- Transaction Hash: 0xabc123...
- Block Number: 4567890
- Gas Price: 20.5 gwei
=================================================

📊 View on Etherscan:
https://sepolia.etherscan.io/address/0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0

🔍 Verify contract with:
npx hardhat verify --network sepolia 0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0
=================================================
```

### Deployment Information Storage

Deployment details are automatically saved to:
- **Latest deployment**: `./deployments/latest-sepolia.json`
- **Timestamped deployment**: `./deployments/deployment-sepolia-[timestamp].json`

## Contract Verification

Verify your deployed contract on Etherscan for transparency and easy interaction.

### Automatic Verification

**Method 1: Using npm script**
```bash
npm run verify
```

**Method 2: Specify contract address**
```bash
npx hardhat run scripts/verify.js --network sepolia [CONTRACT_ADDRESS]
```

**Method 3: Using Hardhat verify command**
```bash
npx hardhat verify --network sepolia [CONTRACT_ADDRESS]
```

### Verification Output

```
=================================================
Literature Review System - Verification Script
=================================================

Network: sepolia
Chain ID: 11155111
=================================================

Verifying contract at address: 0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0
=================================================

Starting verification process...
This may take a few minutes...

✅ Contract verified successfully!
=================================================
View verified contract at:
https://sepolia.etherscan.io/address/0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0#code
=================================================
```

### Manual Verification (Alternative)

If automatic verification fails, verify manually on Etherscan:

1. Go to: https://sepolia.etherscan.io/verifyContract
2. Enter contract address
3. Select **Compiler Type**: Solidity (Single file)
4. Select **Compiler Version**: v0.8.24
5. Select **License Type**: MIT
6. Copy contract source code from `contracts/LiteratureReviewSystem.sol`
7. Enable **Optimization**: Yes (200 runs)
8. Click "Verify and Publish"

## Interaction

Interact with the deployed contract using the interaction script.

### Run Interaction Script

```bash
npm run interact
```

Or with specific contract address:

```bash
npx hardhat run scripts/interact.js --network sepolia [CONTRACT_ADDRESS]
```

### Available Interactions

The interaction script provides:
- View contract state and statistics
- Check submission and review periods
- View submitted works
- View reviewer profiles
- View awards information
- Check user authorization status

### Example Interaction Output

```
=================================================
Literature Review System - Interaction Script
=================================================

Interacting with account: 0x1234...5678
Account balance: 0.45 ETH
=================================================

📊 Contract Information:
=================================================
Owner: 0x1234...5678
Current Submission Period: 1
Current Review Period: 0
Submission Period Active: true
Review Period Active: false
=================================================

📈 Period Statistics:
=================================================
Total Submissions: 2
Submission Active: true
Review Active: false
=================================================
```

## Simulation

Run a complete end-to-end simulation of the system workflow.

### Run Simulation Script

```bash
npm run simulate
```

Or with specific contract address:

```bash
npx hardhat run scripts/simulate.js --network sepolia [CONTRACT_ADDRESS]
```

### Simulation Steps

The simulation performs:
1. ✅ Checks initial contract state
2. ✅ Registers two expert reviewers
3. ✅ Owner approves reviewers
4. ✅ Checks submission period status
5. ✅ Submits literary works (if period active)
6. ✅ Displays submitted works
7. ✅ Checks review period status
8. ✅ Submits reviews (if period active)
9. ✅ Verifies reviewer profiles
10. ✅ Displays summary

### Simulation Output

```
=================================================
Literature Review System - Simulation Script
=================================================

Simulation Accounts:
=================================================
Owner: 0x1234...5678
Author 1: 0x2345...6789
Author 2: 0x3456...7890
Reviewer 1: 0x4567...8901
Reviewer 2: 0x5678...9012
=================================================

Step 1: Checking Initial State
=================================================
Owner: 0x1234...5678
Current Submission Period: 1
Current Review Period: 0
✅ Initial state verified
=================================================

[... simulation continues ...]

Step 10: Simulation Summary
=================================================
✅ Simulation completed successfully!

Actions performed:
  ✓ Registered 2 reviewers
  ✓ Approved 2 reviewers
  ✓ Submitted 2 literary works
  ✓ Submitted 4 reviews
=================================================
```

## Network Information

### Sepolia Testnet Details

| Property | Value |
|----------|-------|
| **Network Name** | Sepolia Testnet |
| **Chain ID** | 11155111 |
| **RPC URL** | https://sepolia.infura.io/v3/[PROJECT_ID] |
| **Currency Symbol** | ETH |
| **Block Explorer** | https://sepolia.etherscan.io |

### Contract Deployment Information

| Property | Value |
|----------|-------|
| **Contract Name** | LiteratureReviewSystem |
| **Contract Address** | 0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0 |
| **Network** | Sepolia Testnet |
| **Compiler Version** | 0.8.24 |
| **Optimization** | Enabled (200 runs) |
| **License** | MIT |

### Important Links

- **Contract on Etherscan**: https://sepolia.etherscan.io/address/0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0
- **Verified Contract Code**: https://sepolia.etherscan.io/address/0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0#code
- **Contract Transactions**: https://sepolia.etherscan.io/address/0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0#txs

## Troubleshooting

### Common Issues and Solutions

#### 1. Insufficient Funds Error

**Error**: `insufficient funds for gas * price + value`

**Solution**:
- Get more Sepolia ETH from faucets
- Check your wallet balance: `npx hardhat run scripts/check-balance.js --network sepolia`

#### 2. Nonce Too High/Low

**Error**: `nonce too high` or `nonce too low`

**Solution**:
- Reset MetaMask account: Settings > Advanced > Reset Account
- Or wait a few minutes and try again

#### 3. Network Timeout

**Error**: `timeout exceeded` or `network timeout`

**Solution**:
- Check your internet connection
- Try a different RPC provider (Infura, Alchemy, or public RPC)
- Increase timeout in `hardhat.config.js`

#### 4. Contract Already Deployed

**Error**: Contract creation code storage out of gas

**Solution**:
- This usually means you're trying to deploy the same contract twice
- Check existing deployments in `./deployments/` folder

#### 5. Verification Failed

**Error**: `Unable to verify contract`

**Solution**:
- Wait 1-2 minutes after deployment before verifying
- Ensure ETHERSCAN_API_KEY is set correctly
- Try manual verification on Etherscan website

#### 6. Private Key Error

**Error**: `invalid private key` or `missing private key`

**Solution**:
- Ensure `.env` file exists and contains `PRIVATE_KEY`
- Remove `0x` prefix from private key if present
- Verify private key is 64 characters (hex)

#### 7. RPC Connection Error

**Error**: `could not detect network`

**Solution**:
- Check SEPOLIA_RPC_URL or INFURA_PROJECT_ID in `.env`
- Test RPC URL: `curl -X POST [RPC_URL] -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'`

### Getting Help

If you encounter issues not covered here:

1. Check Hardhat documentation: https://hardhat.org/docs
2. Review Ethers.js documentation: https://docs.ethers.org
3. Search Sepolia testnet status: https://sepolia.etherscan.io
4. Check FHEVM documentation: https://docs.zama.ai/fhevm

## Additional Scripts

### Start Local Hardhat Node

```bash
npm run node
```

### Deploy to Local Network

```bash
npm run deploy:local
```

### Open Hardhat Console

```bash
npm run console
```

### Run Tests (if available)

```bash
npm test
```

---

## Deployment Checklist

Before deploying to production or mainnet:

- [ ] Environment variables configured in `.env`
- [ ] Sufficient Sepolia ETH in wallet (at least 0.1 ETH)
- [ ] Contract compiled successfully
- [ ] All tests passing (if applicable)
- [ ] Code reviewed and audited
- [ ] RPC provider configured (Infura/Alchemy)
- [ ] Etherscan API key set for verification
- [ ] Backup of private keys secured
- [ ] Deployment script tested on local network
- [ ] Gas price and limit configured appropriately

---

**Last Updated**: 2024-10-28

**Network**: Sepolia Testnet

**Contract Address**: 0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0
