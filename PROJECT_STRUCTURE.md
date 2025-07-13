# Project Structure

## Overview

Complete Hardhat-based development framework for the Literature Review System smart contract with CI/CD integration.

## Directory Structure

```
literature-review-system/
├── .github/
│   ├── workflows/
│   │   └── test.yml                 # CI/CD workflow configuration
│   └── README.md                    # GitHub Actions documentation
├── contracts/
│   └── LiteratureReviewSystem.sol   # Main smart contract
├── scripts/
│   ├── deploy.js                    # Deployment script
│   ├── verify.js                    # Contract verification script
│   ├── interact.js                  # Contract interaction script
│   └── simulate.js                  # End-to-end simulation script
├── test/
│   └── LiteratureReviewSystem.test.js  # Comprehensive test suite
├── deployments/                     # Deployment information storage
│   └── .gitkeep
├── public/                          # Frontend assets
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── .prettierrc.json                 # Prettier configuration
├── .prettierignore                  # Prettier ignore rules
├── .solhint.json                    # Solhint linting rules
├── .solhintignore                   # Solhint ignore rules
├── codecov.yml                      # Code coverage configuration
├── hardhat.config.js                # Hardhat configuration
├── package.json                     # Project dependencies and scripts
├── LICENSE                          # MIT License
├── README.md                        # Main documentation
├── DEPLOYMENT.md                    # Deployment guide
└── PROJECT_STRUCTURE.md             # This file
```

## Key Files

### Configuration Files

| File | Purpose |
|------|---------|
| `hardhat.config.js` | Hardhat framework configuration with Sepolia network setup |
| `.env.example` | Template for environment variables |
| `.solhint.json` | Solidity linting rules and configuration |
| `.prettierrc.json` | Code formatting rules |
| `codecov.yml` | Code coverage reporting configuration |

### Smart Contracts

| File | Description |
|------|-------------|
| `contracts/LiteratureReviewSystem.sol` | Main contract implementing FHE-based literary review system |

### Scripts

| Script | Purpose |
|--------|---------|
| `scripts/deploy.js` | Deploy contract to Sepolia testnet |
| `scripts/verify.js` | Verify contract on Etherscan |
| `scripts/interact.js` | Interact with deployed contract |
| `scripts/simulate.js` | Run complete system simulation |

### Testing

| File | Purpose |
|------|---------|
| `test/LiteratureReviewSystem.test.js` | Comprehensive test suite with 50+ tests |

### CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/test.yml` | GitHub Actions workflow for automated testing |
| `.github/README.md` | CI/CD setup and usage documentation |

## NPM Scripts

### Development

```bash
npm run compile          # Compile smart contracts
npm run clean           # Clean build artifacts
npm run node            # Start local Hardhat node
npm run console         # Open Hardhat console
```

### Testing

```bash
npm test                # Run test suite
npm run coverage        # Generate coverage report
```

### Deployment

```bash
npm run deploy          # Deploy to Sepolia testnet
npm run deploy:local    # Deploy to local network
npm run verify          # Verify contract on Etherscan
npm run interact        # Interact with deployed contract
npm run simulate        # Run end-to-end simulation
```

### Code Quality

```bash
npm run lint            # Run Solhint linter
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run size-contracts  # Check contract sizes
```

## Network Configuration

### Sepolia Testnet

- **Chain ID**: 11155111
- **RPC URL**: Configurable via environment variables
- **Block Explorer**: https://sepolia.etherscan.io

### Local Network

- **URL**: http://127.0.0.1:8545
- **Chain ID**: 31337

## Environment Variables

Required environment variables (see `.env.example`):

```env
PRIVATE_KEY              # Wallet private key for deployment
SEPOLIA_RPC_URL          # Sepolia RPC endpoint URL
INFURA_PROJECT_ID        # Infura project ID (optional)
ETHERSCAN_API_KEY        # Etherscan API key for verification
```

## CI/CD Pipeline

### Workflow Triggers

- Push to `main` or `develop` branches
- All pull requests to `main` or `develop`

### Jobs

1. **Lint**: Code quality checks with Solhint and Prettier
2. **Test**: Run tests on Node.js 18.x and 20.x
3. **Build**: Compile contracts and check sizes
4. **Security**: Run Slither static analysis

### Status Checks

- ✅ Solidity linting
- ✅ Code formatting
- ✅ Contract compilation
- ✅ Test suite execution
- ✅ Code coverage generation
- ✅ Security analysis

## Dependencies

### Production Dependencies

- `@fhevm/solidity`: ^0.5.0 - FHE implementation
- `dotenv`: ^16.3.1 - Environment variable management

### Development Dependencies

- `hardhat`: ^2.19.0 - Development framework
- `@nomicfoundation/hardhat-toolbox`: ^4.0.0 - Hardhat plugins bundle
- `@nomicfoundation/hardhat-verify`: ^2.0.0 - Contract verification
- `ethers`: ^6.9.0 - Ethereum library
- `chai`: ^4.3.10 - Testing framework
- `solhint`: ^4.0.0 - Solidity linter
- `prettier`: ^3.0.0 - Code formatter
- `prettier-plugin-solidity`: ^1.2.0 - Solidity formatting
- `solidity-coverage`: ^0.8.5 - Coverage reporting
- `hardhat-contract-sizer`: ^2.10.0 - Contract size analysis

## Deployment Information

Deployment details are automatically saved to:
- `deployments/latest-{network}.json` - Latest deployment
- `deployments/deployment-{network}-{timestamp}.json` - Historical deployments

## Testing Strategy

### Test Coverage

- Deployment and initialization
- Reviewer registration and approval
- Period management
- Work submission
- Review submission
- Access control
- View functions
- Edge cases and error conditions

### Test Execution

Tests run automatically on:
- Every commit to main/develop branches
- All pull requests
- Multiple Node.js versions (18.x, 20.x)

## Security

### Static Analysis

- Slither for vulnerability detection
- Solhint for best practices
- Automated security scans in CI/CD

### Best Practices

- Comprehensive test coverage
- Access control modifiers
- Input validation
- Gas optimization
- Clear error messages

## Documentation

| Document | Description |
|----------|-------------|
| `README.md` | Project overview and quick start |
| `DEPLOYMENT.md` | Complete deployment guide |
| `PROJECT_STRUCTURE.md` | This file - project structure overview |
| `.github/README.md` | CI/CD documentation |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Maintenance

### Regular Updates

- Update GitHub Actions versions quarterly
- Update dependencies monthly (check for security updates)
- Review and update test coverage regularly
- Update documentation as features change

### Version Control

- Main branch: Production-ready code
- Develop branch: Active development
- Feature branches: Individual features
- Use semantic versioning for releases

---

**Last Updated**: 2025-10-28

**Framework Version**: Hardhat 2.19.0

**Solidity Version**: 0.8.24
