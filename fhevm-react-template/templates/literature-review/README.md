# Literature Review System

A decentralized confidential literary awards platform powered by Fully Homomorphic Encryption (FHE) technology, ensuring complete privacy throughout the submission, review, and award selection process.

## Live Demo

**Web Application:** https://literature-review-system-smoky.vercel.app/

**GitHub Repository:** https://github.com/RomaStamm/LiteratureReviewSystem

**Smart Contract Address:** `0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0`

## Overview

The Literature Review System revolutionizes the literary awards process by leveraging blockchain technology and Fully Homomorphic Encryption (FHE) to create a transparent yet confidential evaluation system. This platform enables authors to submit their literary works with complete privacy while maintaining the integrity and fairness of the review process.

## Architecture

### Gateway Callback Pattern

The system implements an innovative Gateway callback architecture for secure asynchronous decryption:

```
┌─────────────────────────────────────────────────────────────────┐
│                     GATEWAY CALLBACK FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User submits encrypted review scores                         │
│           ↓                                                      │
│  2. Contract records encrypted data + creates request            │
│           ↓                                                      │
│  3. Gateway receives decryption request                          │
│           ↓                                                      │
│  4. Gateway decrypts and calls scoreDecryptionCallback()         │
│           ↓                                                      │
│  5. Contract updates state with decrypted results                │
│                                                                  │
│  [TIMEOUT PATH]                                                  │
│  If Gateway fails or times out (>1 hour):                        │
│           ↓                                                      │
│  Users can claim refunds via claimDecryptionFailureRefund()      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Privacy Protection Mechanisms

#### 1. Division Problem Protection
```
Problem: Division operations can leak individual scores
Solution: Random multiplier obfuscation

Each review receives a privacy multiplier (100-1000):
- Encrypted scores are multiplied by this random value
- Aggregation happens on obfuscated values
- Prevents inference of individual reviewer scores
```

#### 2. Price/Score Obfuscation
```
- Scores are never stored in plaintext
- All FHE operations use encrypted values
- Decryption only reveals aggregate results
- Individual reviewer ratings remain hidden
```

#### 3. Async Processing
```
- Gateway callback pattern ensures secure key management
- Decryption happens off-chain in trusted environment
- On-chain verification via checkSignatures()
```

### Security Features

| Feature | Implementation | Description |
|---------|---------------|-------------|
| Input Validation | `validScore`, `validString`, `validAddress` modifiers | Validates all user inputs before processing |
| Access Control | `onlyOwner`, `onlyAuthorizedReviewer` modifiers | Role-based permission system |
| Overflow Protection | Solidity 0.8+ | Built-in arithmetic overflow checks |
| Reentrancy Guard | `noReentrant` modifier | Prevents reentrancy attacks on fund transfers |
| Timeout Protection | `DECRYPTION_TIMEOUT`, `REVIEW_TIMEOUT` | Prevents permanent fund locking |
| Emergency Pause | `pause()`, `unpause()` | Emergency circuit breaker |

### Gas/HCU Optimization

The contract implements several optimizations for Homomorphic Computation Units (HCU):

1. **Batch Operations**: Aggregate scores are calculated once per work, not per reviewer
2. **Lazy Evaluation**: FHE operations only performed when needed
3. **Storage Optimization**: Reviewer lists stored efficiently for iteration
4. **Minimal Decryption Requests**: Only final aggregate scores are decrypted

## Core Concepts

### FHE-Powered Confidential Literary Work Review

This platform implements **Fully Homomorphic Encryption (FHE)** to enable computation on encrypted data:

- **Encrypted Submissions**: Authors' works and personal information are encrypted on-chain
- **Private Reviews**: Expert reviewers evaluate literary works through encrypted scores
- **Confidential Scoring**: Review scores computed homomorphically without revealing individual ratings
- **Anonymous Awards**: Winners selected based on encrypted aggregate scores

### Refund Mechanism

The system includes comprehensive refund capabilities:

```solidity
// For decryption failures
claimDecryptionFailureRefund(uint32 _period, uint32 _workId)

// For submission timeouts
claimTimeoutRefund(uint32 _period, uint32 _workId)

// For reviewer stake timeouts
claimReviewerTimeoutRefund(uint32 _period, uint32 _workId)
```

**Refund Conditions:**
- Decryption fails or times out (>1 hour)
- Review period ends without completion (>7 days)
- Gateway callback not received

## API Documentation

### Author Functions

#### submitWork
```solidity
function submitWork(
    string memory _title,
    string memory _author,
    string memory _genre,
    string memory _ipfsHash
) external payable
```
Submit a literary work for review.

| Parameter | Type | Description |
|-----------|------|-------------|
| _title | string | Title of the literary work |
| _author | string | Author name |
| _genre | string | Genre category (Fiction, Poetry, Drama, Non-Fiction) |
| _ipfsHash | string | IPFS hash containing the work content |

**Requirements:**
- Must send at least `SUBMISSION_FEE` (0.01 ETH)
- Must be during submission period (first 2 weeks of month)
- String parameters must be 1-256 characters

#### claimTimeoutRefund
```solidity
function claimTimeoutRefund(uint32 _period, uint32 _workId) external
```
Claim refund if work wasn't reviewed within timeout period.

### Reviewer Functions

#### registerReviewer
```solidity
function registerReviewer(
    string memory _name,
    string memory _expertise
) external payable
```
Register as a reviewer with stake.

**Requirements:**
- Must send at least `REVIEW_STAKE` (0.005 ETH)
- Cannot already be registered

#### submitReview
```solidity
function submitReview(
    uint32 _workId,
    uint32 _qualityScore,
    uint32 _originalityScore,
    uint32 _impactScore,
    string memory _encryptedComments
) external payable
```
Submit a confidential review with plaintext scores (encrypted internally).

| Parameter | Type | Description |
|-----------|------|-------------|
| _workId | uint32 | ID of work being reviewed |
| _qualityScore | uint32 | Quality rating (1-100) |
| _originalityScore | uint32 | Originality rating (1-100) |
| _impactScore | uint32 | Impact rating (1-100) |
| _encryptedComments | string | Encrypted feedback comments |

#### submitReviewEncrypted
```solidity
function submitReviewEncrypted(
    uint32 _workId,
    externalEuint32 _encryptedQuality,
    externalEuint32 _encryptedOriginality,
    externalEuint32 _encryptedImpact,
    bytes calldata _inputProof,
    string memory _encryptedComments
) external payable
```
Submit a confidential review with pre-encrypted scores.

### Admin Functions

#### requestScoreDecryption
```solidity
function requestScoreDecryption(uint32 _period, uint32 _workId) external
```
Request Gateway decryption of aggregate scores.

#### scoreDecryptionCallback
```solidity
function scoreDecryptionCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external
```
Gateway callback for score decryption results.

#### calculateResults
```solidity
function calculateResults(uint32 _period) external
```
Calculate final scores and determine category winners.

#### announceAwards
```solidity
function announceAwards(uint32 _period) external
```
Publish award results for a review period.

### View Functions

#### getSubmissionInfo
```solidity
function getSubmissionInfo(uint32 _period, uint32 _workId) external view returns (
    string memory title,
    string memory author,
    string memory genre,
    bool submitted,
    bool reviewed,
    uint256 submissionTime,
    address submitter,
    uint256 depositAmount,
    bool refundClaimed
)
```

#### getReviewerProfile
```solidity
function getReviewerProfile(address _reviewer) external view returns (
    string memory name,
    string memory expertise,
    bool isActive,
    uint32 reviewCount,
    uint256 stakedAmount
)
```

#### getDecryptionStatus
```solidity
function getDecryptionStatus(uint32 _period, uint32 _workId) external view returns (
    uint256 requestId,
    bool completed,
    bool failed,
    uint64 decryptedScore,
    uint256 requestTime
)
```

#### isRefundClaimable
```solidity
function isRefundClaimable(uint32 _period, uint32 _workId, address _reviewer) external view returns (bool)
```

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| SUBMISSION_FEE | 0.01 ETH | Fee to submit a literary work |
| REVIEW_STAKE | 0.005 ETH | Stake required to submit a review |
| MIN_SCORE | 1 | Minimum allowed score |
| MAX_SCORE | 100 | Maximum allowed score |
| DECRYPTION_TIMEOUT | 1 hour | Gateway callback timeout |
| REVIEW_TIMEOUT | 7 days | Maximum time for review completion |
| PRIVACY_MULTIPLIER_MIN | 100 | Minimum privacy multiplier |
| PRIVACY_MULTIPLIER_MAX | 1000 | Maximum privacy multiplier |

## Events

```solidity
event SubmissionPeriodStarted(uint32 indexed period, uint256 startTime);
event ReviewPeriodStarted(uint32 indexed period, uint256 startTime);
event WorkSubmitted(uint32 indexed period, uint32 indexed workId, address indexed submitter, uint256 deposit);
event ReviewSubmitted(uint32 indexed period, uint32 indexed workId, address indexed reviewer, uint256 stake);
event AwardAnnounced(uint32 indexed period, string category, address indexed winner);
event ReviewerRegistered(address indexed reviewer, string name, uint256 stake);
event DecryptionRequested(uint32 indexed period, uint32 indexed workId, uint256 requestId);
event DecryptionCompleted(uint32 indexed period, uint32 indexed workId, uint64 score);
event DecryptionFailed(uint32 indexed period, uint32 indexed workId, uint256 requestId);
event RefundClaimed(address indexed user, uint256 amount, string reason);
event TimeoutRefundClaimed(address indexed user, uint32 indexed period, uint32 indexed workId, uint256 amount);
event ContractPaused(address indexed by);
event ContractUnpaused(address indexed by);
```

## User Workflow

### 1. Submission Phase (Days 1-14)
- Authors submit literary works with encrypted metadata
- Works are stored with IPFS content hash
- Deposit paid to incentivize completion

### 2. Review Phase (Days 15-30)
- Expert reviewers register and receive approval
- Authorized reviewers evaluate works confidentially
- Multi-dimensional scoring: Quality, Originality, Impact (1-100 each)
- Privacy multipliers applied automatically

### 3. Decryption Phase
- Admin requests Gateway decryption
- Aggregate scores computed homomorphically
- Gateway callback provides decrypted results

### 4. Award Announcement
- Category-specific winners determined
- Results published on-chain
- Deposits/stakes returned or distributed

### 5. Refund Phase (If Needed)
- Decryption failure refunds available after 1 hour
- Timeout refunds available after 7 days
- Users can claim their stakes back

## Security Audit Checklist

- [ ] Input validation on all external functions
- [ ] Access control properly implemented
- [ ] Reentrancy protection on fund transfers
- [ ] Integer overflow protection (Solidity 0.8+)
- [ ] Timeout mechanisms prevent permanent locking
- [ ] Emergency pause functionality available
- [ ] Event emission for all state changes
- [ ] Proper FHE permission management
- [ ] Gateway callback signature verification

## Technology Stack

- **Smart Contracts**: Solidity 0.8.24
- **Encryption**: Zama FHEVM for fully homomorphic encryption
- **Storage**: IPFS for decentralized content storage
- **Blockchain**: Ethereum-compatible networks (Sepolia testnet)
- **Frontend**: Modern HTML/CSS/JavaScript

## Use Cases

### International Literary Awards
- Global competitions without geographical bias
- Multi-language support with fair evaluation
- Cultural sensitivity through encrypted identities

### Academic Literary Research
- Peer review for scholarly literary analysis
- Thesis evaluation with anonymous assessment
- Journal submissions with private review

### Publishing House Contests
- Manuscript selection with fair evaluation
- Talent discovery without bias
- Rights protection through encryption

## Benefits

### For Authors
- Merit-based recognition
- Intellectual property protection
- Transparent yet private process

### For Reviewers
- Independent evaluation
- Reputation building
- Stake-based commitment

### For Award Organizations
- Enhanced credibility
- Reduced controversy
- Automated fair selection

## License

MIT License - Open-source and available for use in promoting fair and confidential literary evaluation worldwide.

## Contact & Support

- **GitHub Repository**: https://github.com/RomaStamm/LiteratureReviewSystem
- **GitHub Issues**: https://github.com/RomaStamm/LiteratureReviewSystem/issues
- **Live Application**: https://literature-review-system-smoky.vercel.app/

---

**Built for the global literary community | Powered by Fully Homomorphic Encryption | Securing creativity through cryptography**
