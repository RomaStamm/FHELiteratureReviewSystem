# FHE Literature Review System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://docs.soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![FHEVM](https://img.shields.io/badge/FHEVM-Zama-blue.svg)](https://docs.zama.ai/fhevm)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)

> **A modern, production-ready decentralized literary awards platform built with Next.js 14 and React 18, powered by Fully Homomorphic Encryption (FHE) to ensure complete privacy throughout the submission, review, and award selection process.**

## 🌐 Live Demo & Resources

- **Live Application**: [https://fhe-literature-review-system.vercel.app/](https://fhe-literature-review-system.vercel.app/)
- **GitHub Repository**: [https://github.com/RomaStamm/FHELiteratureReviewSystem](https://github.com/RomaStamm/FHELiteratureReviewSystem)
- **Video Demonstration**: `demo.mp4` (Download required for viewing - streaming links unavailable)
- **Smart Contract Address**: `0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0`
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0)

## 📖 Overview

The FHE Literature Review System revolutionizes the literary awards process by leveraging blockchain technology and Fully Homomorphic Encryption (FHE) to create a transparent yet confidential evaluation system. Built with Next.js 14, React 18, and TypeScript, this production-ready application provides a modern, responsive interface for authors to submit their literary works with complete privacy while maintaining the integrity and fairness of the review process.

**Modern Technology Stack:**
- 🚀 **Next.js 14** - Server and client components with App Router
- ⚛️ **React 18** - Modern component-based UI
- 📘 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS** - Responsive design system
- 🔐 **FHEVM SDK** - Integrated FHE operations
- ⛓️ **Ethers.js v6** - Web3 blockchain interaction

## 🎯 Core Concepts

### Gateway Callback Architecture with Refund & Timeout Protection

The system implements an **innovative Gateway callback pattern** that ensures robustness and fairness:

```
User Flow (Secure & Protected)
┌────────────────────────────────────────────────────┐
│ Step 1: User submits encrypted review             │
│ → Contract records encrypted data + creates       │
│   decryption request (Gateway pattern)            │
└────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────┐
│ Step 2: Gateway decrypts & executes callback       │
│ → Success: Update contract with score             │
│ → Failure: User can claim refund (protection)     │
└────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────┐
│ Step 3: Timeout Protection                         │
│ → If decryption exceeds timeout (1 hour):         │
│   User automatically eligible for refund          │
│ → Prevents permanent fund locking                 │
└────────────────────────────────────────────────────┘
```

**Key Protections:**
- **Refund Mechanism**: Full stake refunded if decryption fails
- **Timeout Safety**: 1-hour timeout prevents permanent locking
- **Async Processing**: Gateway callback ensures eventual consistency
- **Audit Trail**: All operations logged for transparency

### Privacy Innovation: Division & Price Leakage Protection

This platform introduces **advanced privacy techniques** to prevent cryptanalysis:

1. **Division Problem Solution**
   - Random multipliers (100-1000x) applied to each score before aggregation
   - Makes it cryptographically infeasible to extract individual scores from totals
   - Multipliers remain encrypted during computation

2. **Price Leakage Prevention (Score Obfuscation)**
   - Individual scores are "fuzzy aggregated" with randomization
   - Prevents pattern recognition across review periods
   - Stops cryptanalysis attacks on encrypted aggregates

3. **HCU Optimization (Homomorphic Computation Unit)**
   - All computations performed on encrypted data
   - Minimal on-chain data exposure
   - Gas-optimized ciphertext handling

### FHE-Powered Confidential Literary Manuscript Review

This platform implements **Fully Homomorphic Encryption (FHE)** to enable computation on encrypted data, ensuring that sensitive information remains confidential throughout the entire awards process:

```
┌──────────────────────────────────────────────────────────┐
│         Confidential Manuscript Review Process           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Author → Encrypted Submission → FHE Contract           │
│             ↓                        ↓                   │
│      Manuscript Metadata    Review Assignment           │
│      (Title, Genre, Hash)   (Expert Reviewers)          │
│             ↓                        ↓                   │
│      Encrypted Storage      Encrypted Evaluation        │
│             ↓                        ↓                   │
│      Privacy Protected      Homomorphic Computation     │
│             ↓                        ↓                   │
│      Anonymous Review       Aggregate Scores            │
│             ↓                        ↓                   │
│      Fair Evaluation        Winner Selection            │
│             ↓                        ↓                   │
│      Award Announcement     Public Recognition          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Privacy Features:**
- **Encrypted Submissions**: Authors' manuscripts and personal information encrypted on-chain
- **Private Reviews**: Expert reviewers evaluate works through encrypted scores and comments
- **Confidential Scoring**: Review scores computed homomorphically without revealing individual ratings
- **Anonymous Awards**: Winners selected based on encrypted aggregate scores

### Privacy-Preserving Literary Awards Selection

The platform addresses critical challenges in traditional literary award systems:

#### 1. **Eliminating Bias**
By encrypting author identities and submission details, the system prevents:
- Nepotism and favoritism during the review process
- Gender, race, or nationality-based discrimination
- Reputation bias affecting new or unknown authors
- Geographic or institutional preferences

#### 2. **Protecting Intellectual Property**
Unpublished literary works remain confidential:
- Manuscripts stored securely with encrypted metadata
- Content hashes verify integrity without exposing text
- IPFS integration for decentralized storage
- Selective disclosure only to authorized reviewers

#### 3. **Fair Evaluation**
FHE enables mathematical operations on encrypted scores:
- Objective winner selection without exposing individual judgments
- Homomorphic addition aggregates reviewer scores
- Tamper-proof computation guarantees fairness
- No single party can manipulate results

#### 4. **Transparent Process**
Blockchain technology provides immutable records:
- All submissions and reviews permanently recorded
- Verifiable audit trail for dispute resolution
- Public verification of award results
- Cryptographic proof of fair selection

#### 5. **Reviewer Independence**
Encrypted reviews prevent external pressure:
- Reviewer anonymity protected by cryptography
- No way to trace individual scores to reviewers
- Freedom to provide honest, critical feedback
- Protection from author retaliation

## 🛡️ Security & Innovation Architecture

### Input Validation & Access Control

```
Security Layers (Progressive Defense)
┌─────────────────────────────────────┐
│ Layer 1: Input Validation           │
│ - Score range enforcement (1-100)   │
│ - String length validation          │
│ - Address zero-check                │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ Layer 2: Access Control             │
│ - Role-based authorization          │
│ - Period gating (submission/review) │
│ - Reviewer approval requirement     │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ Layer 3: Overflow Protection        │
│ - Solidity 0.8+ built-in checks     │
│ - Safe arithmetic operations        │
│ - No integer overflow vulnerabilities
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ Layer 4: Reentrancy Guards          │
│ - noReentrant modifier on sensitive │
│   functions (refunds, withdrawals)  │
│ - Checks-Effects-Interactions       │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ Layer 5: Audit Logging              │
│ - All critical operations logged    │
│ - Reviewer approval/revocation      │
│ - Refund claims tracked            │
│ - Decryption status monitored       │
└─────────────────────────────────────┘
```

### Timeout & Refund Mechanisms

**Three-Layer Protection Against Fund Locking:**

1. **Decryption Failure Refund** (1 hour timeout)
   - If Gateway decryption fails or doesn't complete
   - Reviewers can claim full stake refund
   - Prevents loss of funds due to external service failure

2. **Submission Timeout Refund** (7 days)
   - Authors recover deposits if work isn't reviewed
   - Ensures funds don't lock indefinitely
   - Automatic eligibility after timeout

3. **Reviewer Timeout Refund** (7 days)
   - Reviewers recover stakes on timeout
   - Eligible if decryption failed or hasn't completed
   - Fair compensation for commitment

### API Audit Points

The contract emits detailed audit events for monitoring:

```solidity
// Approval/Revocation
event ReviewerApproved(address indexed reviewer)
event ReviewerRevoked(address indexed reviewer)

// Decryption Status
event DecryptionRequested(uint32 indexed period, uint32 indexed workId, uint256 requestId)
event DecryptionCompleted(uint32 indexed period, uint32 indexed workId, uint64 score)
event DecryptionFailed(uint32 indexed period, uint32 indexed workId, uint256 requestId)
event DecryptionTimeout(uint32 indexed period, uint32 indexed workId, uint256 requestId)
event GatewayCallbackExecuted(uint256 indexed requestId, bool success, uint64 score)

// Refund Tracking
event DecryptionFailureRefundIssued(address indexed reviewer, uint256 amount, uint256 requestId)
event ReviewerTimeoutRefundIssued(address indexed reviewer, uint256 amount, uint32 period, uint32 workId)
event SubmitterTimeoutRefundIssued(address indexed submitter, uint256 amount, uint32 period, uint32 workId)

// Comprehensive Audit Log
event AuditLog(string indexed action, address indexed user, uint256 timestamp, string details)
```

## ✨ Key Features

### For Authors

- **Secure Submission**: Submit literary works with encrypted metadata
  - Title, author name, genre, content hash
  - Protection against plagiarism and unauthorized access
  - Real-time submission confirmation

- **Privacy Protection**: Author identity remains confidential
  - Anonymous during review period
  - Revealed only after award announcement
  - Control over personal information disclosure

- **Multiple Categories**: Support for various literary genres
  - Fiction (novels, short stories)
  - Poetry (collections, individual poems)
  - Drama (plays, screenplays)
  - Non-Fiction (essays, memoirs)

- **IPFS Integration**: Decentralized storage for complete works
  - Permanent, censorship-resistant storage
  - Content-addressed retrieval
  - Bandwidth optimization

- **Submission Tracking**: Monitor status and progress
  - Submission confirmation
  - Review assignment notifications
  - Award announcement alerts

### For Expert Reviewers

- **Confidential Evaluation**: Submit encrypted reviews
  - Quality score (1-100)
  - Originality score (1-100)
  - Impact score (1-100)
  - Detailed textual feedback

- **Anonymous Feedback**: Maintain reviewer anonymity
  - Honest, unbiased evaluation
  - Protection from author retaliation
  - Independent judgment

- **Professional Recognition**: Build verifiable reputation
  - Review contribution history
  - Expertise demonstration
  - Community standing

- **Flexible Scoring**: Multi-dimensional evaluation
  - Customizable criteria
  - Weighted scoring options
  - Comparative analysis

- **Review Management**: Access past evaluations
  - Review history tracking
  - Performance analytics
  - Continuous improvement insights

### For Administrators

- **Period Management**: Control submission and review phases
  - Submission window configuration
  - Review deadline enforcement
  - Results announcement timing

- **Reviewer Authorization**: Approve qualified experts
  - Credential verification
  - Expertise validation
  - Access control management

- **Award Announcements**: Publish winners transparently
  - Category-specific results
  - Public verification data
  - Historical award records

- **Statistical Insights**: Monitor platform activity
  - Submission volume metrics
  - Review completion rates
  - Participation analytics

- **Quality Control**: Ensure fair processes
  - Review completeness verification
  - Dispute resolution mechanisms
  - System integrity monitoring

## 🔐 Technical Architecture

### FHE Implementation

The platform utilizes Fully Homomorphic Encryption from Zama to perform computations on encrypted data without decryption:

```
┌─────────────────────────────────────────────────────────┐
│              FHE Computation Pipeline                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Step 1: Encryption                                     │
│  Reviewer Scores → FHE Encrypt → Encrypted Scores      │
│  [85, 90, 88] → [E₁, E₂, E₃]                           │
│                                                          │
│  Step 2: Homomorphic Addition                           │
│  E₁ + E₂ + E₃ → Encrypted Total                        │
│  (Computation on encrypted data)                        │
│                                                          │
│  Step 3: Homomorphic Comparison                         │
│  Compare encrypted totals → Encrypted Rankings         │
│  (Determine winner without decryption)                  │
│                                                          │
│  Step 4: Selective Decryption                           │
│  Decrypt winner only → Public Announcement             │
│  (Individual scores remain confidential)                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Key FHE Operations:**
- **Homomorphic Addition**: Aggregate multiple encrypted review scores
- **Homomorphic Comparison**: Compare encrypted totals to determine rankings
- **Selective Decryption**: Reveal winners only after achieving consensus
- **Zero-Knowledge Proofs**: Verify computations without exposing data

### Smart Contract Architecture

```solidity
contract LiteratureReviewSystem {
    // Core Components (Enhanced with Gateway Pattern)

    1. Submission Management
       - Store encrypted manuscript metadata
       - Track submission status and timeline
       - Manage IPFS content references
       - Timeout protection for deposits (7 days)

    2. Reviewer Registry & Authorization
       - Maintain authorized expert list
       - Track reviewer credentials
       - Manage review assignments
       - Audit logging for approvals/revocations

    3. Review System (Gateway Pattern)
       - Store encrypted evaluations
       - Aggregate scores using FHE with privacy multipliers
       - Prevent duplicate reviews
       - Async decryption via Gateway callbacks
       - Refund mechanism for failed/timeout decryptions

    4. Privacy Protection Engine
       - Division problem solution: Random multipliers (100-1000x)
       - Price leakage prevention: Fuzzy score aggregation
       - HCU optimization: Gas-efficient ciphertext operations
       - Encrypted metadata throughout lifecycle

    5. Refund & Protection System
       - Decryption failure refunds (1 hour timeout)
       - Submission timeout refunds (7 days)
       - Reviewer timeout refunds (7 days)
       - Reentrancy guards on fund transfers
       - Comprehensive audit logging

    6. Award Engine
       - Calculate winners using FHE operations
       - Determine category-specific results
       - Manage award announcements
       - Selective decryption only after approval

    7. Period Controller
       - Enforce submission deadlines
       - Control review windows
       - Schedule result releases
       - Emergency pause mechanism
}
```

### Enhanced Features (Reference from )

The contract incorporates innovative patterns from decentralized systems:

1. **Gateway Callback Pattern** (from BeliefMarket)
   - Async decryption requests with callback verification
   - Solves timeout and reliability issues
   - Ensures eventual consistency in FHE operations

2. **Refund Mechanisms**
   - Decryption failure refund (prevents loss from external service issues)
   - Timeout refunds (prevents permanent fund locking)
   - Three-layer protection ensures fairness

3. **Privacy Multipliers**
   - Random numbers applied to encrypted scores
   - Prevents score inference through mathematical analysis
   - Protects against division-based attacks

4. **Audit Trail**
   - All critical operations logged as events
   - Reviewer management tracked completely
   - Refund claims documented for transparency
   - Decryption status monitored end-to-end

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Smart Contracts** | Solidity 0.8.24 | Core business logic with FHE |
| **Development** | Hardhat | Testing and deployment framework |
| **Encryption** | Zama FHEVM | Fully homomorphic encryption |
| **Gateway Pattern** | FHE Callbacks | Async decryption with verification |
| **Storage** | IPFS | Decentralized content storage |
| **Blockchain** | Ethereum Sepolia | Testnet deployment |
| **Frontend Framework** | Next.js 14 | Modern React application with App Router |
| **UI Library** | React 18 | Component-based user interface |
| **Language** | TypeScript 5.0 | Type-safe development |
| **Styling** | Tailwind CSS | Responsive design system |
| **Web3 Library** | Ethers.js v6 | Blockchain interaction |
| **SDK** | @fhevm/sdk | FHE operations + privacy multipliers |
| **Security** | Slither, Solhint | Static code analysis |
| **Audit** | Event Logging | Comprehensive operation audit trail |
| **CI/CD** | GitHub Actions | Automated testing and deployment |

### Frontend Architecture

```
┌──────────────────────────────────────────────────────┐
│              Next.js 14 Application                  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  App Router Structure                                │
│  ├── src/app/                                       │
│  │   ├── layout.tsx        Root layout & metadata  │
│  │   ├── page.tsx          Main application page   │
│  │   └── globals.css       Global styles           │
│  │                                                   │
│  ├── src/components/       React Components         │
│  │   ├── ConnectionStatus  Wallet connection UI    │
│  │   ├── Notification      Toast messages          │
│  │   ├── SubmitWork        Submission interface    │
│  │   ├── ExpertReview      Review dashboard        │
│  │   ├── StatusView        System monitoring       │
│  │   └── AwardsView        Results display         │
│  │                                                   │
│  └── Integration                                     │
│      ├── Ethers.js v6      Web3 connectivity       │
│      ├── @fhevm/sdk        FHE operations          │
│      ├── TypeScript        Type safety             │
│      └── Tailwind CSS      Responsive design       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Frontend Features:**
- **Server Components**: Optimized performance with React Server Components
- **Client Components**: Interactive UI with client-side state management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live contract state monitoring
- **Error Handling**: Comprehensive error messages and recovery
- **Loading States**: User feedback during blockchain transactions
- **Wallet Integration**: Seamless MetaMask and Web3 wallet support
- **Type Safety**: Full TypeScript coverage for reliability

### Privacy Guarantees

```
┌──────────────────────────────────────────────────────┐
│            Security & Privacy Layers                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Layer 1: Encryption at Rest                        │
│  └─ All sensitive data encrypted on-chain           │
│                                                      │
│  Layer 2: Input Validation & Access Control         │
│  └─ Role-based authorization, score validation      │
│                                                      │
│  Layer 3: Homomorphic Computation                   │
│  └─ Process data without decryption (HCU optimized) │
│                                                      │
│  Layer 4: Privacy Multipliers                       │
│  └─ Random obfuscation protects against division    │
│     and pattern-based attacks                       │
│                                                      │
│  Layer 5: Fuzzy Aggregation                         │
│  └─ Score obfuscation prevents inference attacks    │
│                                                      │
│  Layer 6: Gateway Callback Pattern                  │
│  └─ Async decryption with timeout protection       │
│     prevents permanent locking                      │
│                                                      │
│  Layer 7: Selective Disclosure                      │
│  └─ Reveal only authorized information after        │
│     approval and successful decryption             │
│                                                      │
│  Layer 8: Comprehensive Audit Trail                 │
│  └─ Blockchain ensures tamper-proof records         │
│     with detailed event logging                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Privacy Innovation Summary:**

| Protection | Method | Benefit |
|-----------|--------|---------|
| **Division Leakage** | Random multipliers (100-1000x) | Prevents score inference |
| **Price Leakage** | Fuzzy aggregation | Stops pattern recognition |
| **Timeout Attacks** | 1-hour + 7-day refunds | Ensures fund recovery |
| **Reentrancy** | Guard on all refund functions | Prevents double spending |
| **Access Control** | Role-based permissions | Limits unauthorized use |
| **Audit Trail** | Comprehensive event logging | Full transparency |

## 🎬 Demo Video

**Video File**: `demo.mp4` (Download required for viewing)

The demonstration video is available in the repository root. Due to technical limitations, streaming links are not available - please download the file directly to view.

**Demo Contents:**
- Author submitting an encrypted literary manuscript
- Expert reviewer registration and authorization process
- Confidential review submission with encrypted scores
- Automatic FHE computation of aggregate scores
- Award announcement and result verification
- End-to-end workflow demonstration

## 🏆 Use Cases

### 1. International Literary Awards

**Scenario**: Global literary prize with submissions from 50+ countries

**Benefits:**
- **Geographic Neutrality**: No bias based on author location
- **Language Diversity**: Fair evaluation across languages
- **Cultural Sensitivity**: Protected from political or cultural prejudice
- **Accessibility**: Open to authors regardless of publishing status

**Example**: International Booker Prize, Nobel Prize in Literature alternatives

### 2. Academic Literary Research

**Scenario**: University literature departments conducting peer reviews

**Benefits:**
- **Blind Review**: True double-blind peer review process
- **Academic Integrity**: Prevent favoritism in thesis evaluations
- **Journal Quality**: Fair manuscript selection for publications
- **Research Protection**: Safeguard unpublished scholarly work

**Example**: Literary journal submissions, PhD dissertation reviews

### 3. Publishing House Manuscript Selection

**Scenario**: Publishers evaluating unsolicited manuscripts

**Benefits:**
- **Merit-Based Selection**: Discover talent without preconceptions
- **IP Protection**: Secure handling of unpublished manuscripts
- **Unbiased Evaluation**: Remove author background from consideration
- **Efficient Screening**: Systematic evaluation process

**Example**: First novel competitions, emerging writer programs

### 4. Creative Writing Communities

**Scenario**: Online writing groups organizing competitions

**Benefits:**
- **Fair Contests**: Eliminate favoritism in community awards
- **Honest Feedback**: Provide critique without damaging relationships
- **Skill Development**: Track improvement through anonymous reviews
- **Community Trust**: Build credibility through transparent processes

**Example**: Writing workshop contests, online fiction communities

## 🚀 Quick Start & Deployment

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: Latest stable version
- **MetaMask**: Browser wallet extension
- **Sepolia ETH**: Get from [Sepolia Faucet](https://sepoliafaucet.com/)
- **Infura Account**: For RPC endpoint (optional but recommended)
- **Etherscan API Key**: For contract verification

### Installation

```bash
# Clone the repository
git clone https://github.com/RomaStamm/FHELiteratureReviewSystem.git
cd FHELiteratureReviewSystem

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Running the Application

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser

# The Next.js frontend will be available with:
# - Work submission interface
# - Expert review dashboard
# - Status monitoring
# - Awards display
```

### Configuration

Edit `.env` file with your credentials:

```env
# Deployment Configuration
PRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Gas Configuration (optional)
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Coverage Configuration (optional)
SOLIDITY_COVERAGE=true

# Security Configuration
ENABLE_SLITHER=true
```

### Smart Contract Deployment

```bash
# Compile contracts
npm run compile

# Run tests with coverage
npm test

# Run security analysis
npm run security

# Deploy to Sepolia testnet
npm run deploy

# Verify contract on Etherscan
npm run verify

# Interact with deployed contract
npm run interact

# Run complete workflow simulation
npm run simulate
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build Next.js production bundle |
| `npm start` | Start Next.js production server |
| `npm run compile` | Compile smart contracts |
| `npm run test` | Run comprehensive test suite |
| `npm run coverage` | Generate test coverage report |
| `npm run deploy` | Deploy to Sepolia testnet |
| `npm run verify` | Verify contract on Etherscan |
| `npm run interact` | Interact with deployed contract |
| `npm run simulate` | Run end-to-end simulation |
| `npm run lint` | Run all linters (Next.js + Solidity) |
| `npm run lint:sol` | Lint Solidity code |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run security` | Run Slither security analysis |
| `npm run clean` | Clean build artifacts |

### Project Structure

```
literature-review/
├── src/                          # Next.js Application
│   ├── app/
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Main application page
│   │   └── globals.css          # Global styles
│   └── components/              # React Components
│       ├── ConnectionStatus.tsx # Wallet connection indicator
│       ├── Notification.tsx     # Toast notifications
│       ├── SubmitWork.tsx       # Work submission interface
│       ├── ExpertReview.tsx     # Review dashboard
│       ├── StatusView.tsx       # System status display
│       └── AwardsView.tsx       # Awards results
│
├── contracts/                   # Solidity Smart Contracts
│   └── LiteratureReviewSystem.sol
│
├── scripts/                     # Deployment Scripts
│   └── deploy.js
│
├── test/                        # Test Suite
│   └── LiteratureReviewSystem.test.js
│
├── hardhat.config.js           # Hardhat configuration
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

### Deployment Documentation

For detailed deployment instructions, security considerations, and troubleshooting, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [SECURITY.md](./SECURITY.md) - Security best practices
- [PERFORMANCE.md](./PERFORMANCE.md) - Gas optimization guide

## 🔄 Security Audit & Quality Assurance

### Complete Security Toolchain

```
┌─────────────────────────────────────────────────────────┐
│  Security Audit & Performance Optimization Pipeline     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Smart Contract Layer                                   │
│  ├── Hardhat Framework → Development & Testing          │
│  ├── Solhint → Solidity Linting & Best Practices       │
│  ├── Gas Reporter → Cost Monitoring & Optimization      │
│  ├── Contract Sizer → Deployment Size Limits           │
│  ├── Solidity Optimizer → Bytecode Optimization         │
│  └── Slither → Static Security Analysis                 │
│                                                          │
│  Code Quality Layer                                      │
│  ├── ESLint → JavaScript/TypeScript Linting            │
│  ├── Prettier → Code Formatting & Consistency           │
│  ├── TypeScript → Type Safety                           │
│  └── Pre-commit Hooks → Quality Gates (Husky)          │
│                                                          │
│  CI/CD & Automation                                      │
│  ├── GitHub Actions → Automated Testing                 │
│  ├── Security Checks → Vulnerability Scanning           │
│  ├── Coverage Reports → Test Completeness               │
│  └── Performance Tests → Gas & Load Testing             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Security Features

| Feature | Tool | Benefit |
|---------|------|---------|
| **Solidity Linting** | Solhint | Best practices enforcement |
| **Static Analysis** | Slither | Vulnerability detection |
| **Gas Monitoring** | Hardhat Gas Reporter | Cost optimization |
| **Code Quality** | ESLint, Prettier | Consistency & readability |
| **DoS Protection** | Custom patterns | Attack mitigation |
| **Pre-commit Hooks** | Husky | Shift-left security |
| **CI/CD Automation** | GitHub Actions | Continuous security |

### Running Security Checks

```bash
# Run all security checks
npm run security

# Lint Solidity contracts
npm run lint:sol

# Analyze gas usage
npm run test:gas

# Generate coverage report
npm run coverage

# Run Slither analysis
npx slither .

# Audit dependencies
npm audit
```

## 📋 User Workflow

### Phase 1: Submission Period

**Timeline**: Weeks 1-4 (configurable)

```
Author Actions:
1. Connect Web3 wallet
2. Prepare manuscript metadata
3. Upload full text to IPFS
4. Submit encrypted entry:
   - Title (encrypted)
   - Author name (encrypted)
   - Genre selection
   - IPFS content hash
   - Submission timestamp
5. Receive confirmation transaction
```

### Phase 2: Review Period

**Timeline**: Weeks 5-8 (configurable)

```
Reviewer Actions:
1. Register as expert reviewer
2. Await administrator approval
3. Receive assigned manuscripts
4. Evaluate each work:
   - Quality score (1-100)
   - Originality score (1-100)
   - Impact score (1-100)
   - Written feedback (encrypted)
5. Submit encrypted review
```

### Phase 3: Calculation Period

**Timeline**: Week 9 (automated)

```
System Actions:
1. Aggregate all encrypted scores
2. Perform homomorphic addition:
   Total = Quality + Originality + Impact
3. Compare encrypted totals
4. Determine category winners
5. Generate result proofs
```

### Phase 4: Announcement Period

**Timeline**: Week 10+ (public)

```
Administrator Actions:
1. Trigger award announcement
2. Publish winner addresses
3. Release aggregate scores
4. Maintain review confidentiality
5. Generate public certificates
```

## 🌟 Benefits

### For the Literary Community

- **Merit-Based Recognition**: Awards based on quality, not connections
- **Inclusive Participation**: Open to all authors regardless of background
- **IP Safety**: Protected environment for unpublished works
- **Trust in Process**: Cryptographic guarantees of fairness
- **Global Accessibility**: No geographic barriers
- **Professional Development**: Constructive feedback from experts

### For Award Organizations

- **Enhanced Credibility**: Cryptographically verifiable selection
- **Reduced Controversy**: Provable neutrality minimizes disputes
- **Efficient Management**: Automated scoring and winner selection
- **Global Reach**: Attract international participants
- **Cost Savings**: Reduce administrative overhead
- **Transparency**: Public verification without compromising privacy

### For the Blockchain Ecosystem

- **FHE Showcase**: Demonstrate practical cryptography application
- **Privacy Innovation**: Pioneer confidential computing in creative industries
- **Adoption Driver**: Bring literary community to blockchain
- **Standard Setting**: Establish privacy-preserving evaluation patterns
- **Research Contribution**: Advance FHE implementation techniques

## 🔒 Security Considerations

### Contract Security

- **Access Control**: Role-based permissions for all functions
- **Reentrancy Protection**: Guards on state-changing functions
- **Integer Overflow**: Solidity 0.8.24 built-in protection
- **Time Manipulation**: Secure period enforcement
- **Front-Running**: Encrypted submissions prevent manipulation

### Privacy Protection

- **End-to-End Encryption**: All sensitive data encrypted
- **Key Management**: Secure key generation and storage
- **Metadata Privacy**: Minimal on-chain data exposure
- **Review Anonymity**: Cryptographic reviewer protection
- **Selective Disclosure**: Granular information control

### Operational Security

- **Multi-Signature Administration**: Distributed control
- **Emergency Pause**: Circuit breaker for critical issues
- **Upgrade Path**: Proxy pattern for contract updates
- **Audit Trail**: Comprehensive event logging
- **Dispute Resolution**: Clear escalation procedures

## 🔮 Future Enhancements

### Short-Term (3-6 months)

- [x] **Modern React Frontend** - Completed with Next.js 14 and TypeScript
- [x] **Mobile-Responsive Design** - Implemented with Tailwind CSS
- [ ] Multi-round review process
- [ ] Category-specific scoring criteria
- [ ] Multiple language support (i18n)
- [ ] Reviewer reputation system
- [ ] Progressive Web App (PWA) support

### Medium-Term (6-12 months)

- [ ] Decentralized governance with DAO structure
- [ ] Token incentive system for reviewers
- [ ] AI-assisted preliminary screening
- [ ] Cross-platform publishing integration
- [ ] Advanced analytics dashboard with charts
- [ ] Real-time notifications using WebSockets
- [ ] Enhanced accessibility (WCAG 2.1 AA compliance)

### Long-Term (12+ months)

- [ ] Layer 2 scaling solution (Arbitrum/Optimism)
- [ ] Mainnet deployment with production security audit
- [ ] Full DAO governance structure
- [ ] NFT award certificates on-chain
- [ ] Interoperability with other literary platforms
- [ ] Native mobile applications (iOS/Android)
- [ ] API for third-party integrations
- [ ] Decentralized storage migration (IPFS/Arweave)

## 🤝 Contributing

We welcome contributions from:
- **Literary Professionals**: Feedback on review processes
- **Blockchain Developers**: Smart contract improvements
- **Cryptography Experts**: FHE optimization
- **Security Researchers**: Vulnerability reports
- **UI/UX Designers**: Interface enhancements
- **Technical Writers**: Documentation improvements

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linting (`npm run lint`)
6. Commit your changes (follow conventional commits)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

MIT License - This project is open-source and available for use in promoting fair and confidential literary evaluation worldwide.

## 📧 Contact & Support

- **GitHub Repository**: [https://github.com/RomaStamm/FHELiteratureReviewSystem](https://github.com/RomaStamm/FHELiteratureReviewSystem)
- **Live Application**: [https://fhe-literature-review-system.vercel.app/](https://fhe-literature-review-system.vercel.app/)
- **Issue Tracker**: [GitHub Issues](https://github.com/RomaStamm/FHELiteratureReviewSystem/issues)
- **Documentation**: See [docs/](./docs/) directory

---

**Built for the Global Literary Community | Powered by Fully Homomorphic Encryption | Securing Creativity Through Cryptography**

🚀 Built with **Next.js 14** • ⚛️ **React 18** • 📘 **TypeScript** • 🎨 **Tailwind CSS** • 🔐 **FHEVM** • ⛓️ **Ethers.js v6**

📚 [Deployment Guide](DEPLOYMENT.md) | 🔒 [Security Policy](SECURITY.md) | ⚡ [Performance Guide](PERFORMANCE.md) | 🎥 [Demo Video](demo.mp4)
