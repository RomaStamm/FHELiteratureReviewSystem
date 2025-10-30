# Literature Review System

A decentralized confidential literary awards platform powered by Fully Homomorphic Encryption (FHE) technology, ensuring complete privacy throughout the submission, review, and award selection process.

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
# Start the Next.js frontend
npm run dev

# Open http://localhost:3000
```

### Smart Contract Development

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Sepolia testnet
npm run deploy
```

## 🌐 Live Demo

**Web Application:** https://literature-review-system-smoky.vercel.app/

 

**Smart Contract Address:** `0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0`

## 📖 Overview

The Literature Review System revolutionizes the literary awards process by leveraging blockchain technology and Fully Homomorphic Encryption (FHE) to create a transparent yet confidential evaluation system. This platform enables authors to submit their literary works with complete privacy while maintaining the integrity and fairness of the review process.

## 🎯 Core Concepts

### FHE-Powered Confidential Literary Work Review

This platform implements **Fully Homomorphic Encryption (FHE)** to enable computation on encrypted data, ensuring that sensitive information remains confidential throughout the entire awards process:

- **Encrypted Submissions**: Authors' works and personal information are encrypted on-chain, protecting their identity and content from unauthorized access
- **Private Reviews**: Expert reviewers can evaluate literary works through encrypted scores and comments, preventing bias and manipulation
- **Confidential Scoring**: Review scores (quality, originality, impact) are computed homomorphically, ensuring fair evaluation without revealing individual reviewer ratings
- **Anonymous Awards**: Winners are selected based on encrypted aggregate scores, maintaining confidentiality until the official announcement

### Privacy-Preserving Literary Awards Selection

The platform addresses critical challenges in traditional literary award systems:

1. **Eliminating Bias**: By encrypting author identities and submission details, the system prevents nepotism and favoritism during the review process
2. **Protecting Intellectual Property**: Unpublished literary works remain confidential, safeguarding authors' creative rights
3. **Fair Evaluation**: FHE enables mathematical operations on encrypted scores, ensuring objective winner selection without exposing individual judgments
4. **Transparent Process**: Blockchain technology provides immutable records of all submissions and reviews while maintaining privacy
5. **Reviewer Independence**: Encrypted reviews prevent external pressure or influence on expert evaluators

## ✨ Key Features

### For Authors

- **Secure Submission**: Submit literary works with encrypted metadata (title, author name, genre, content hash)
- **Privacy Protection**: Author identity remains confidential during the review period
- **Real-time Status**: Track submission status and review progress
- **Multiple Categories**: Support for Fiction, Poetry, Drama, and Non-Fiction genres
- **IPFS Integration**: Decentralized storage for complete literary works

### For Expert Reviewers

- **Confidential Evaluation**: Submit encrypted reviews with quality, originality, and impact scores
- **Anonymous Feedback**: Provide detailed comments while maintaining reviewer anonymity
- **Professional Recognition**: Build reputation through verifiable review contributions
- **Flexible Scoring**: Rate literary works on multiple dimensions (1-100 scale)
- **Review History**: Access past evaluations and contributions

### For Administrators

- **Period Management**: Control submission and review periods
- **Reviewer Authorization**: Approve qualified experts to participate in evaluations
- **Award Announcements**: Publish winners after encrypted score computation
- **Statistical Insights**: Monitor platform activity and participation metrics
- **Quality Control**: Ensure fair and thorough review processes

## 🔐 Technical Architecture

### FHE Implementation

The platform utilizes Fully Homomorphic Encryption to perform computations on encrypted data:

```
Encrypted Scores → Homomorphic Addition → Encrypted Total → Decryption → Winner
```

**Key Operations:**
- **Homomorphic Addition**: Aggregate multiple encrypted review scores
- **Homomorphic Comparison**: Compare encrypted totals to determine rankings
- **Threshold Decryption**: Reveal winners only after achieving consensus

### Smart Contract Components

- **Submission Management**: Handle encrypted work submissions and metadata
- **Reviewer Registry**: Maintain authorized expert reviewer list
- **Review System**: Store and process encrypted evaluations
- **Award Engine**: Calculate winners using FHE operations
- **Period Controller**: Manage submission and review timeframes

### Technology Stack

- **Smart Contracts**: Solidity 0.8.24
- **Encryption**: Zama FHEVM for fully homomorphic encryption
- **Storage**: IPFS for decentralized content storage
- **Blockchain**: Ethereum-compatible networks
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Ethers.js v6
- **SDK**: @fhevm/sdk for FHE operations

### Privacy Guarantees

- **Zero-Knowledge Proofs**: Verify submissions without revealing content
- **Encrypted Storage**: All sensitive data stored in encrypted format on-chain
- **Selective Disclosure**: Only reveal information when explicitly authorized
- **Immutable Records**: Blockchain ensures tamper-proof audit trail

## 🎬 Demo Video

Watch our comprehensive demonstration showcasing the complete workflow from submission to award announcement:



The video demonstrates:
- Author submitting an encrypted literary work
- Expert reviewer registration and authorization
- Confidential review submission with encrypted scores
- Automatic FHE computation of winner
- Award announcement and result verification

## 📸 On-Chain Transaction Screenshots

LiteratureReviewSystem.png

## 🏆 Use Cases

### International Literary Awards

- **Global Competitions**: Enable worldwide participation without geographical bias
- **Multi-Language Support**: Evaluate works across different languages fairly
- **Cultural Sensitivity**: Protect authors from cultural or political bias

### Academic Literary Research

- **Peer Review**: Confidential evaluation of scholarly literary analysis
- **Thesis Evaluation**: Anonymous assessment of graduate literary research
- **Journal Submissions**: Private review process for academic publications

### Publishing House Contests

- **Manuscript Selection**: Fair evaluation of unpublished works
- **Talent Discovery**: Identify promising authors without bias
- **Rights Protection**: Secure handling of intellectual property

### Creative Writing Communities

- **Writing Competitions**: Organize fair contests with encrypted submissions
- **Feedback Exchange**: Provide honest critiques without personal conflicts
- **Skill Development**: Track improvement through anonymous peer reviews

## 📋 User Workflow

### 1. Submission Phase
- Authors submit literary works during the active submission period
- Work details include: title, author name, genre, and IPFS content hash
- All sensitive data is encrypted using FHE before storing on-chain

### 2. Review Phase
- Expert reviewers register and await administrator approval
- Authorized reviewers evaluate submitted works confidentially
- Multi-dimensional scoring: Quality (1-100), Originality (1-100), Impact (1-100)
- Review comments are encrypted to maintain privacy

### 3. Calculation Phase
- System performs homomorphic operations on encrypted scores
- Aggregate calculations completed without decrypting individual reviews
- Fair and unbiased winner selection based on mathematical computation

### 4. Announcement Phase
- Category-specific award results published
- Winner addresses revealed while maintaining review confidentiality
- Historical award records available for transparency

## 🌟 Benefits

### For the Literary Community

- **Merit-Based Recognition**: Awards based solely on literary quality, not connections
- **Inclusive Participation**: Open to all authors regardless of background or status
- **Intellectual Property Safety**: Protected environment for sharing unpublished works
- **Trust in Process**: Cryptographic guarantees of fairness and confidentiality

### For Award Organizations

- **Enhanced Credibility**: Cryptographically verifiable fair selection process
- **Reduced Controversy**: Minimize disputes through provable neutrality
- **Efficient Management**: Automated scoring and winner selection
- **Global Reach**: Attract international participants with privacy assurances

### For the Blockchain Ecosystem

- **FHE Showcase**: Demonstrate practical application of advanced cryptography
- **Privacy Innovation**: Pioneer confidential computing in creative industries
- **Adoption Driver**: Bring literary community to blockchain technology
- **Standard Setting**: Establish best practices for privacy-preserving evaluations

## 🔒 Security Features

- **Complete Review Encryption**: All scores and comments encrypted using FHE
- **Reviewer Identity Protection**: Prevent external pressure and manipulation
- **Automated Smart Contract Execution**: Ensure procedural fairness
- **Time-Locked Periods**: Enforce proper workflow and prevent premature access
- **Immutable Audit Trail**: All actions permanently recorded on blockchain
- **Multi-Signature Administration**: Distributed control over critical functions

## 🔮 Future Enhancements

- **Multi-Round Reviews**: Support for preliminary screening and final evaluation rounds
- **Category-Specific Criteria**: Customizable scoring dimensions for different genres
- **Reviewer Reputation System**: Track expert accuracy and reliability over time
- **Decentralized Governance**: Community voting on award criteria and processes
- **Cross-Platform Integration**: Connect with literary databases and publishing platforms
- **AI-Assisted Analysis**: Optional encrypted AI evaluation alongside human reviews
- **Token Incentives**: Reward authors, reviewers, and platform participants
- **Mobile Application**: Native mobile experience for submissions and reviews

## 🤝 Contributing

We welcome contributions from the literary community, blockchain developers, and cryptography experts. Together, we can build a fairer, more transparent system for recognizing literary excellence.

**Areas for Contribution:**
- Smart contract optimization and security audits
- Frontend user experience improvements
- FHE implementation enhancements
- Documentation and translation
- Testing and quality assurance

## 📄 License

MIT License - This project is open-source and available for use in promoting fair and confidential literary evaluation worldwide.

## 📧 Contact & Support

For inquiries, collaboration opportunities, or support:
 
- **Live Application**: https://literature-review-system-smoky.vercel.app/

---

**Built with ❤️ for the global literary community | Powered by Fully Homomorphic Encryption | Securing creativity through cryptography**
