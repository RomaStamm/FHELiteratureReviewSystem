# API Reference

Complete reference for the LiteratureReviewSystem smart contract.

## Contract Overview

**Contract Name**: `LiteratureReviewSystem`
**Solidity Version**: 0.8.24
**Network**: Ethereum Sepolia Testnet
**Address**: `0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0`

## Table of Contents

- [Enums](#enums)
- [Structs](#structs)
- [State Variables](#state-variables)
- [Functions](#functions)
- [Events](#events)
- [Modifiers](#modifiers)
- [Errors](#errors)

## Enums

### Genre

Literary work categories.

```solidity
enum Genre {
    Fiction,      // 0: Novels, short stories
    Poetry,       // 1: Poems, poetry collections
    Drama,        // 2: Plays, screenplays
    NonFiction    // 3: Essays, memoirs
}
```

### Period

Workflow phases for the award cycle.

```solidity
enum Period {
    Submission,   // 0: Authors submit works
    Review,       // 1: Reviewers evaluate
    Calculation,  // 2: System computes winners
    Announcement  // 3: Results published
}
```

## Structs

### Work

Represents a submitted literary work.

```solidity
struct Work {
    address author;              // Author's wallet address
    euint32 encryptedTitle;     // FHE-encrypted title
    euint32 encryptedAuthorName; // FHE-encrypted author name
    Genre genre;                 // Literary genre
    string ipfsHash;            // IPFS content hash
    uint256 submissionTime;     // Block timestamp
    bool exists;                // Existence flag
}
```

**Storage**: `mapping(uint256 => Work) public works`

### Review

Represents an encrypted review evaluation.

```solidity
struct Review {
    address reviewer;                    // Reviewer's address
    uint256 workId;                     // Work being reviewed
    euint32 encryptedQualityScore;      // Quality (1-100)
    euint32 encryptedOriginalityScore;  // Originality (1-100)
    euint32 encryptedImpactScore;       // Impact (1-100)
    string encryptedComments;           // Encrypted feedback
    uint256 reviewTime;                 // Submission timestamp
    bool exists;                        // Existence flag
}
```

**Storage**: `mapping(uint256 => mapping(address => Review)) public reviews`

### Reviewer

Represents an authorized expert reviewer.

```solidity
struct Reviewer {
    address reviewerAddress;  // Reviewer's wallet
    bool isAuthorized;       // Authorization status
    uint256 registrationTime; // Registration timestamp
    uint256 reviewCount;     // Number of reviews submitted
}
```

**Storage**: `mapping(address => Reviewer) public reviewers`

### AwardResult

Represents award results for a genre.

```solidity
struct AwardResult {
    uint256 workId;              // Winning work ID
    address author;              // Winner's address
    Genre genre;                 // Genre category
    euint32 encryptedTotalScore; // Aggregate encrypted score
    uint256 announcementTime;    // Announcement timestamp
    bool announced;              // Announcement status
}
```

**Storage**: `mapping(Genre => AwardResult) public awards`

## State Variables

### Public Variables

```solidity
// Admin address
address public admin;

// Work tracking
uint256 public workCount;           // Total works submitted
mapping(uint256 => Work) public works;

// Review tracking
mapping(uint256 => mapping(address => Review)) public reviews;
mapping(uint256 => uint256) public reviewCounts;

// Reviewer management
mapping(address => Reviewer) public reviewers;
address[] public reviewerList;
uint256 public reviewerCount;

// Period management
Period public currentPeriod;
mapping(Period => uint256) public periodEndTimes;

// Award results
mapping(Genre => AwardResult) public awards;
```

## Functions

### Administrative Functions

#### `setPeriod`

Set the current award cycle period.

```solidity
function setPeriod(Period _period) external onlyAdmin
```

**Parameters:**
- `_period`: New period to set

**Emits**: `PeriodChanged(Period newPeriod)`

**Access**: Admin only

**Example**:
```javascript
await contract.setPeriod(1); // Set to Review period
```

---

#### `authorizeReviewer`

Authorize an expert reviewer to evaluate works.

```solidity
function authorizeReviewer(address _reviewer) external onlyAdmin
```

**Parameters:**
- `_reviewer`: Address to authorize

**Emits**: `ReviewerAuthorized(address reviewer)`

**Access**: Admin only

**Requirements**:
- Reviewer must be registered
- Reviewer not already authorized

**Example**:
```javascript
await contract.authorizeReviewer("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
```

---

#### `revokeReviewer`

Revoke reviewer authorization.

```solidity
function revokeReviewer(address _reviewer) external onlyAdmin
```

**Parameters:**
- `_reviewer`: Address to revoke

**Emits**: `ReviewerRevoked(address reviewer)`

**Access**: Admin only

---

### Author Functions

#### `submitWork`

Submit a literary work for evaluation.

```solidity
function submitWork(
    bytes calldata encryptedTitle,
    bytes calldata encryptedAuthorName,
    Genre genre,
    string calldata ipfsHash
) external inPeriod(Period.Submission) returns (uint256)
```

**Parameters:**
- `encryptedTitle`: FHE-encrypted work title
- `encryptedAuthorName`: FHE-encrypted author name
- `genre`: Literary genre category
- `ipfsHash`: IPFS hash of full content

**Returns**: `uint256` - Work ID

**Emits**: `WorkSubmitted(uint256 workId, address author, Genre genre)`

**Requirements**:
- Must be in Submission period
- Valid encrypted data

**Example**:
```javascript
const encryptedTitle = await fhevm.encrypt32(titleValue);
const encryptedAuthor = await fhevm.encrypt32(authorValue);

const tx = await contract.submitWork(
    encryptedTitle,
    encryptedAuthor,
    0, // Fiction
    "QmX..."
);
```

---

#### `getWork`

Retrieve work details.

```solidity
function getWork(uint256 workId) external view returns (Work memory)
```

**Parameters:**
- `workId`: ID of the work

**Returns**: `Work` struct

**Example**:
```javascript
const work = await contract.getWork(1);
console.log('Author:', work.author);
console.log('Genre:', work.genre);
```

---

### Reviewer Functions

#### `registerReviewer`

Register as a reviewer (requires admin authorization).

```solidity
function registerReviewer() external
```

**Emits**: `ReviewerRegistered(address reviewer)`

**Requirements**:
- Not already registered

**Example**:
```javascript
await contract.registerReviewer();
// Wait for admin authorization
```

---

#### `submitReview`

Submit an encrypted review for a work.

```solidity
function submitReview(
    uint256 workId,
    bytes calldata encryptedQuality,
    bytes calldata encryptedOriginality,
    bytes calldata encryptedImpact,
    string calldata encryptedComments
) external onlyAuthorizedReviewer inPeriod(Period.Review)
```

**Parameters:**
- `workId`: Work to review
- `encryptedQuality`: FHE-encrypted quality score (1-100)
- `encryptedOriginality`: FHE-encrypted originality score (1-100)
- `encryptedImpact`: FHE-encrypted impact score (1-100)
- `encryptedComments`: Encrypted review comments

**Emits**: `ReviewSubmitted(uint256 workId, address reviewer)`

**Requirements**:
- Must be authorized reviewer
- Must be in Review period
- Cannot review same work twice
- Work must exist

**Example**:
```javascript
const quality = await fhevm.encrypt32(85);
const originality = await fhevm.encrypt32(90);
const impact = await fhevm.encrypt32(88);

await contract.submitReview(
    workId,
    quality,
    originality,
    impact,
    "Excellent work with innovative narrative structure"
);
```

---

#### `getReview`

Retrieve review details.

```solidity
function getReview(
    uint256 workId,
    address reviewer
) external view returns (Review memory)
```

**Parameters:**
- `workId`: Work ID
- `reviewer`: Reviewer address

**Returns**: `Review` struct

---

### Award Functions

#### `calculateWinners`

Calculate winners using FHE operations.

```solidity
function calculateWinners(Genre genre)
    external
    onlyAdmin
    inPeriod(Period.Calculation)
```

**Parameters:**
- `genre`: Genre to calculate winner for

**Emits**: `WinnerCalculated(Genre genre, uint256 workId)`

**Requirements**:
- Must be in Calculation period
- At least one work in genre

**Process**:
1. Aggregate all encrypted review scores
2. Perform homomorphic addition
3. Compare encrypted totals
4. Determine highest score
5. Store encrypted result

---

#### `announceWinner`

Announce the winner for a genre.

```solidity
function announceWinner(Genre genre)
    external
    onlyAdmin
    inPeriod(Period.Announcement)
```

**Parameters:**
- `genre`: Genre to announce winner for

**Emits**: `WinnerAnnounced(Genre genre, uint256 workId, address author)`

**Requirements**:
- Must be in Announcement period
- Winner must be calculated

---

#### `getAwardResult`

Get award results for a genre.

```solidity
function getAwardResult(Genre genre)
    external
    view
    returns (AwardResult memory)
```

**Parameters:**
- `genre`: Genre to query

**Returns**: `AwardResult` struct

---

### View Functions

#### `getWorksByGenre`

Get all work IDs for a specific genre.

```solidity
function getWorksByGenre(Genre genre)
    external
    view
    returns (uint256[] memory)
```

**Parameters:**
- `genre`: Genre to filter by

**Returns**: Array of work IDs

---

#### `getReviewCount`

Get number of reviews for a work.

```solidity
function getReviewCount(uint256 workId)
    external
    view
    returns (uint256)
```

**Parameters:**
- `workId`: Work to query

**Returns**: Number of reviews

---

#### `hasReviewed`

Check if reviewer has reviewed a work.

```solidity
function hasReviewed(uint256 workId, address reviewer)
    external
    view
    returns (bool)
```

**Parameters:**
- `workId`: Work ID
- `reviewer`: Reviewer address

**Returns**: `true` if reviewed, `false` otherwise

---

## Events

### `WorkSubmitted`

Emitted when a work is submitted.

```solidity
event WorkSubmitted(
    uint256 indexed workId,
    address indexed author,
    Genre indexed genre,
    uint256 submissionTime
);
```

---

### `ReviewSubmitted`

Emitted when a review is submitted.

```solidity
event ReviewSubmitted(
    uint256 indexed workId,
    address indexed reviewer,
    uint256 reviewTime
);
```

---

### `ReviewerRegistered`

Emitted when a reviewer registers.

```solidity
event ReviewerRegistered(address indexed reviewer);
```

---

### `ReviewerAuthorized`

Emitted when a reviewer is authorized.

```solidity
event ReviewerAuthorized(address indexed reviewer);
```

---

### `ReviewerRevoked`

Emitted when reviewer authorization is revoked.

```solidity
event ReviewerRevoked(address indexed reviewer);
```

---

### `PeriodChanged`

Emitted when the award period changes.

```solidity
event PeriodChanged(Period newPeriod);
```

---

### `WinnerCalculated`

Emitted when a winner is calculated.

```solidity
event WinnerCalculated(
    Genre indexed genre,
    uint256 indexed workId
);
```

---

### `WinnerAnnounced`

Emitted when a winner is announced.

```solidity
event WinnerAnnounced(
    Genre indexed genre,
    uint256 indexed workId,
    address indexed author
);
```

---

## Modifiers

### `onlyAdmin`

Restricts function access to admin only.

```solidity
modifier onlyAdmin() {
    require(msg.sender == admin, "Not admin");
    _;
}
```

---

### `onlyAuthorizedReviewer`

Restricts function access to authorized reviewers.

```solidity
modifier onlyAuthorizedReviewer() {
    require(
        reviewers[msg.sender].isAuthorized,
        "Not authorized reviewer"
    );
    _;
}
```

---

### `inPeriod`

Restricts function execution to specific period.

```solidity
modifier inPeriod(Period _period) {
    require(currentPeriod == _period, "Invalid period");
    _;
}
```

---

## Errors

### Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `"Not admin"` | Function called by non-admin | Use admin account |
| `"Not authorized reviewer"` | Reviewer not authorized | Wait for admin authorization |
| `"Invalid period"` | Wrong award period | Wait for correct period |
| `"Work does not exist"` | Invalid work ID | Check work ID |
| `"Already reviewed"` | Duplicate review attempt | Each reviewer reviews once |
| `"Already registered"` | Duplicate registration | Reviewer already in system |

---

## Gas Estimates

Approximate gas costs for common operations:

| Operation | Gas Cost |
|-----------|----------|
| `submitWork` | ~200,000 |
| `submitReview` | ~180,000 |
| `registerReviewer` | ~60,000 |
| `authorizeReviewer` | ~50,000 |
| `calculateWinners` | ~150,000 |
| `announceWinner` | ~80,000 |

*Note: Actual costs vary based on network conditions and data size.*

---

## Code Examples

### Complete Submission Flow

```javascript
// 1. Connect wallet
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();

// 2. Initialize FHEVM
const fhevm = await initializeFHEVM(provider);

// 3. Encrypt data
const encTitle = await fhevm.encrypt32(stringToNumber("My Novel"));
const encAuthor = await fhevm.encrypt32(stringToNumber("John Doe"));

// 4. Submit work
const contract = new ethers.Contract(ADDRESS, ABI, signer);
const tx = await contract.submitWork(
    encTitle,
    encAuthor,
    0, // Fiction
    "QmX..."
);

// 5. Wait for confirmation
const receipt = await tx.wait();
console.log('Work ID:', receipt.events[0].args.workId);
```

### Complete Review Flow

```javascript
// 1. Encrypt scores
const quality = await fhevm.encrypt32(85);
const originality = await fhevm.encrypt32(90);
const impact = await fhevm.encrypt32(88);

// 2. Submit review
const tx = await contract.submitReview(
    workId,
    quality,
    originality,
    impact,
    "Excellent character development"
);

await tx.wait();
console.log('Review submitted successfully');
```

---

## Further Reading

- [Architecture Guide](./ARCHITECTURE.md)
- [FHE Implementation](./FHE_IMPLEMENTATION.md)
- [Testing Guide](./TESTING.md)

---

**Last Updated**: 2024
**Version**: 1.0.0
