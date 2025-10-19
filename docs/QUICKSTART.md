# Quick Start Guide

Get the FHE Literature Review System running in under 5 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** v18.0.0 or higher
- **MetaMask** browser extension installed
- **Sepolia ETH** for testing (get from [faucet](https://sepoliafaucet.com/))

## Installation (2 minutes)

```bash
# Clone the repository
git clone https://github.com/RomaStamm/FHELiteratureReviewSystem.git
cd FHELiteratureReviewSystem

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Configuration (1 minute)

Edit `.env` file with minimal configuration:

```env
PRIVATE_KEY=your_metamask_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

## Deploy Contract (1 minute)

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy
```

After deployment, you'll see:

```
✓ LiteratureReviewSystem deployed to: 0x...
✓ Contract verified on Etherscan
```

## Test the System (1 minute)

```bash
# Run the complete simulation
npm run simulate
```

This will:
1. Submit a test manuscript
2. Register a reviewer
3. Submit an encrypted review
4. Calculate and announce winners

## Next Steps

### For Authors
- Read the [Author Guide](./AUTHOR_GUIDE.md)
- Visit the live application at https://fhe-literature-review-system.vercel.app/

### For Reviewers
- Read the [Reviewer Guide](./REVIEWER_GUIDE.md)
- Learn about the evaluation criteria

### For Developers
- Explore the [Architecture Documentation](./ARCHITECTURE.md)
- Review the [API Reference](./API_REFERENCE.md)

## Verify Everything Works

### Check Contract on Etherscan

1. Visit https://sepolia.etherscan.io/
2. Search for your contract address
3. Verify contract is deployed and verified

### Run Tests

```bash
# Run test suite
npm test

# Generate coverage report
npm run coverage
```

You should see:
```
  LiteratureReviewSystem
    ✓ Should deploy successfully
    ✓ Should allow work submission
    ✓ Should allow review submission
    ✓ Should calculate winners correctly

  31 passing (5s)
```

## Common Issues

### "Insufficient funds"
- Get Sepolia ETH from the faucet: https://sepoliafaucet.com/

### "Network error"
- Check your RPC URL in `.env`
- Verify you're connected to Sepolia network

### "Contract deployment failed"
- Ensure your private key has enough Sepolia ETH
- Check network connectivity

## What's Next?

Now that you have the system running:

1. **Explore the Frontend**: Visit the live demo
2. **Read Documentation**: Dive into specific guides
3. **Customize**: Modify for your use case
4. **Deploy Production**: Follow the [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile contracts |
| `npm test` | Run tests |
| `npm run deploy` | Deploy to Sepolia |
| `npm run verify` | Verify on Etherscan |
| `npm run simulate` | Run full simulation |
| `npm run interact` | Interact with deployed contract |

## Support

- **Documentation**: [Full documentation](./README.md)
- **Issues**: [GitHub Issues](https://github.com/RomaStamm/FHELiteratureReviewSystem/issues)
- **Live Demo**: https://fhe-literature-review-system.vercel.app/

---

**Congratulations!** You now have a working FHE Literature Review System. Continue to the relevant user guide for your role.
