# Smart Contract Architecture

This document provides a comprehensive overview of the FHE Literature Review System's technical architecture.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  FHE Literature Review System                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend Layer                                             │
│  ├── Web Interface (HTML/CSS/JS)                           │
│  ├── MetaMask Integration                                  │
│  └── IPFS Client                                           │
│           │                                                 │
│           ▼                                                 │
│  Blockchain Layer (Ethereum Sepolia)                       │
│  ├── LiteratureReviewSystem.sol                            │
│  │   ├── Submission Management                             │
│  │   ├── Reviewer Registry                                 │
│  │   ├── Review System                                     │
│  │   ├── FHE Operations                                    │
│  │   └── Award Engine                                      │
│  │                                                          │
│  └── FHEVM Library (Zama)                                  │
│      ├── euint32 (Encrypted Scores)                        │
│      ├── Homomorphic Operations                            │
│      └── Access Control Lists                              │
│           │                                                 │
│           ▼                                                 │
│  Storage Layer                                              │
│  ├── On-Chain: Encrypted Data                             │
│  └── IPFS: Full Manuscript Content                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Submission Management

**Purpose**: Handle literary work submissions with encrypted metadata.

```solidity
struct Work {
    address author;              // Author's Ethereum address
    euint32 encryptedTitle;     // FHE-encrypted title
    euint32 encryptedAuthorName; // FHE-encrypted author name
    Genre genre;                 // Public genre category
    string ipfsHash;            // IPFS content hash
    uint256 submissionTime;     // Timestamp
    bool exists;                // Existence flag
}

mapping(uint256 => Work) public works;
uint256 public workCount;
```

**Key Functions**:
- `submitWork()`: Accept encrypted literary submissions
- `getWork()`: Retrieve work metadata
- `getWorksByGenre()`: Filter by genre

**Security Features**:
- Encrypted sensitive data (title, author name)
- Time-based submission window enforcement
- Duplicate submission prevention
- Genre-based categorization

### 2. Reviewer Registry

**Purpose**: Manage authorized expert reviewers.

```solidity
struct Reviewer {
    address reviewerAddress;
    bool isAuthorized;
    uint256 registrationTime;
    uint256 reviewCount;
}

mapping(address => Reviewer) public reviewers;
address[] public reviewerList;
```

**Key Functions**:
- `registerReviewer()`: Request reviewer status
- `authorizeReviewer()`: Admin approval
- `revokeReviewer()`: Remove authorization
- `getReviewerInfo()`: Query reviewer details

**Access Control**:
- Only administrators can authorize reviewers
- Reviewers must be authorized before submitting reviews
- Review count tracking for reputation

### 3. Review System

**Purpose**: Store and process encrypted evaluations.

```solidity
struct Review {
    address reviewer;
    uint256 workId;
    euint32 encryptedQualityScore;    // 1-100
    euint32 encryptedOriginalityScore; // 1-100
    euint32 encryptedImpactScore;      // 1-100
    string encryptedComments;          // Encrypted feedback
    uint256 reviewTime;
    bool exists;
}

mapping(uint256 => mapping(address => Review)) public reviews;
mapping(uint256 => uint256) public reviewCounts;
```

**Key Functions**:
- `submitReview()`: Submit encrypted evaluation
- `getReview()`: Retrieve review data
- `getWorkReviews()`: Get all reviews for a work
- `hasReviewed()`: Check review status

**FHE Operations**:
- All scores encrypted using `euint32` type
- Homomorphic addition for score aggregation
- Access control for decryption

### 4. Award Engine

**Purpose**: Calculate winners using FHE operations.

```solidity
struct AwardResult {
    uint256 workId;
    address author;
    Genre genre;
    euint32 encryptedTotalScore; // Aggregate FHE score
    uint256 announcementTime;
    bool announced;
}

mapping(Genre => AwardResult) public awards;
```

**Key Functions**:
- `calculateWinners()`: Compute encrypted totals
- `announceWinner()`: Reveal winner by genre
- `getAwardResults()`: Query award status

**FHE Computation Flow**:

```
Step 1: Aggregate Scores
encryptedTotal = encryptedQuality + encryptedOriginality + encryptedImpact

Step 2: Compare Works
For each work in genre:
    Calculate encrypted total
    Compare using FHE operations
    Track highest score

Step 3: Determine Winner
Winner = work with highest encrypted total
(Individual scores remain confidential)

Step 4: Announcement
Reveal winner address and aggregate score
Individual review scores stay encrypted
```

### 5. Period Controller

**Purpose**: Enforce workflow timeline.

```solidity
enum Period {
    Submission,   // Authors submit works
    Review,       // Reviewers evaluate
    Calculation,  // System computes winners
    Announcement  // Results published
}

Period public currentPeriod;
mapping(Period => uint256) public periodEndTimes;
```

**Key Functions**:
- `setPeriod()`: Admin controls period transitions
- `getCurrentPeriod()`: Query active period
- `isPeriodActive()`: Validate operations

**Period Rules**:
- Submissions only during Submission period
- Reviews only during Review period
- Calculations only during Calculation period
- Announcements only during Announcement period

## FHE Integration

### Encrypted Data Types

```solidity
// Import Zama FHEVM library
import "fhevm/lib/TFHE.sol";

// Encrypted 32-bit unsigned integers
euint32 encryptedScore;

// Encrypted boolean
ebool encryptedFlag;
```

### Encryption Operations

```solidity
// Client-side encryption (before submission)
const encrypted = await fhevm.encrypt(plainValue);

// On-chain homomorphic addition
euint32 total = TFHE.add(score1, score2);

// On-chain comparison
ebool isGreater = TFHE.gt(total1, total2);

// Selective decryption (authorized only)
uint32 plainValue = TFHE.decrypt(encrypted);
```

### Access Control Lists (ACL)

```solidity
// Grant decryption permission
TFHE.allow(encryptedValue, authorizedAddress);

// Check permission
bool canDecrypt = TFHE.isAllowed(encryptedValue, address);
```

## Data Flow

### Submission Flow

```
1. Author prepares manuscript
   └─> Upload to IPFS
       └─> Get content hash

2. Author encrypts metadata
   └─> Title, Author Name
       └─> Client-side FHE encryption

3. Author submits to contract
   └─> submitWork(encrypted, genre, ipfsHash)
       └─> Store on-chain

4. Contract validates
   └─> Check period (Submission)
   └─> Check not duplicate
   └─> Emit WorkSubmitted event
```

### Review Flow

```
1. Reviewer evaluates work
   └─> Read from IPFS
       └─> Assess quality, originality, impact

2. Reviewer encrypts scores
   └─> Client-side FHE encryption
       └─> Three separate scores (1-100)

3. Reviewer submits review
   └─> submitReview(workId, encryptedScores, comments)
       └─> Store on-chain

4. Contract validates
   └─> Check period (Review)
   └─> Check authorized reviewer
   └─> Check not duplicate review
   └─> Emit ReviewSubmitted event
```

### Calculation Flow

```
1. Admin triggers calculation
   └─> calculateWinners(genre)
       └─> During Calculation period

2. Smart contract aggregates
   └─> For each work in genre:
       └─> Sum all encrypted review scores
           └─> Homomorphic addition

3. Smart contract compares
   └─> FHE comparison operations
       └─> Determine highest score

4. Store encrypted results
   └─> Winner workId + encrypted total
       └─> Ready for announcement
```

### Announcement Flow

```
1. Admin announces winner
   └─> announceWinner(genre)
       └─> During Announcement period

2. Contract reveals winner
   └─> Decrypt winner address
   └─> Publish aggregate score
   └─> Keep individual scores encrypted

3. Public verification
   └─> Anyone can verify winner
   └─> Cryptographic proof of fairness
   └─> Individual reviews remain private
```

## Security Architecture

### Access Control

```solidity
// Role-based access control
modifier onlyAdmin() {
    require(msg.sender == admin, "Not authorized");
    _;
}

modifier onlyAuthorizedReviewer() {
    require(reviewers[msg.sender].isAuthorized, "Not authorized reviewer");
    _;
}

modifier inPeriod(Period _period) {
    require(currentPeriod == _period, "Invalid period");
    _;
}
```

### Reentrancy Protection

```solidity
// Use OpenZeppelin's ReentrancyGuard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LiteratureReviewSystem is ReentrancyGuard {
    function submitWork(...) external nonReentrant {
        // Protected function
    }
}
```

### Time-Lock Security

```solidity
// Prevent premature period transitions
modifier validPeriodTransition() {
    require(block.timestamp >= periodEndTimes[currentPeriod], "Period not ended");
    _;
}
```

## Gas Optimization

### Storage Optimization

```solidity
// Pack variables efficiently
struct Work {
    address author;        // 20 bytes
    uint96 submissionTime; // 12 bytes  } 32 bytes (one slot)

    Genre genre;           // 1 byte
    bool exists;           // 1 byte    } 32 bytes (one slot)

    // Encrypted data in separate slots
    euint32 encryptedTitle;
    euint32 encryptedAuthorName;
    string ipfsHash;
}
```

### Function Optimization

```solidity
// Use calldata for read-only parameters
function submitWork(
    bytes calldata encryptedTitle,  // calldata cheaper than memory
    bytes calldata encryptedAuthorName,
    Genre genre,
    string calldata ipfsHash
) external {
    // Function body
}
```

### Event Optimization

```solidity
// Indexed parameters for efficient filtering
event WorkSubmitted(
    uint256 indexed workId,
    address indexed author,
    Genre indexed genre,
    uint256 submissionTime
);
```

## Upgrade Strategy

### Proxy Pattern

```solidity
// Use OpenZeppelin's upgradeable contracts
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract LiteratureReviewSystem is Initializable {
    function initialize(address _admin) public initializer {
        admin = _admin;
        currentPeriod = Period.Submission;
    }
}
```

### Data Migration

```solidity
// Version tracking
uint256 public constant VERSION = 1;

// Migration functions
function migrateData(uint256 startId, uint256 endId) external onlyAdmin {
    // Batch data migration
}
```

## Testing Architecture

### Unit Tests

```javascript
describe("LiteratureReviewSystem", function() {
    describe("Submission", function() {
        it("Should accept valid submissions");
        it("Should reject submissions outside period");
        it("Should prevent duplicate submissions");
    });

    describe("Reviews", function() {
        it("Should accept authorized reviewer submissions");
        it("Should reject unauthorized reviewers");
        it("Should prevent duplicate reviews");
    });
});
```

### Integration Tests

```javascript
describe("Complete Workflow", function() {
    it("Should complete full award cycle", async function() {
        // 1. Submit works
        // 2. Register reviewers
        // 3. Submit reviews
        // 4. Calculate winners
        // 5. Announce results
    });
});
```

## Performance Metrics

### Gas Costs (Approximate)

| Operation | Gas Cost |
|-----------|----------|
| Submit Work | ~200,000 gas |
| Submit Review | ~180,000 gas |
| Calculate Winner | ~150,000 gas |
| Announce Winner | ~80,000 gas |

### Optimization Targets

- Contract size: < 24KB (deployment limit)
- Function gas: < 300,000 per transaction
- Storage reads: Minimize to < 5 per function
- External calls: Batch when possible

## Further Reading

- [FHE Implementation Details](./FHE_IMPLEMENTATION.md)
- [API Reference](./API_REFERENCE.md)
- [Security Guide](./SECURITY_GUIDE.md)
- [Gas Optimization Guide](./GAS_OPTIMIZATION.md)

---

**Last Updated**: 2024
**Version**: 1.0.0
