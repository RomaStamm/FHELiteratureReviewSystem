# FHE Implementation Guide

This document explains how Fully Homomorphic Encryption (FHE) is implemented in the Literature Review System using Zama's FHEVM library.

## What is FHE?

Fully Homomorphic Encryption (FHE) allows computations to be performed on encrypted data without decrypting it. This enables:

- **Privacy**: Sensitive data remains encrypted at all times
- **Computation**: Mathematical operations on encrypted values
- **Verification**: Results are cryptographically verifiable
- **Compliance**: Meet privacy regulations (GDPR, HIPAA)

## FHE in Literature Reviews

### The Challenge

Traditional literary review systems expose:
- Author identities during review
- Individual reviewer scores
- Scoring patterns and biases
- Preliminary results before announcement

### The FHE Solution

```
┌─────────────────────────────────────────────────────┐
│         FHE-Protected Review Process                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Plaintext → Encryption → On-Chain Storage          │
│  (Client)      (FHE)       (Encrypted)              │
│                                                      │
│  Score: 85 → E(85) → euint32: 0x4a3f2... (stored)  │
│                                                      │
│  Computation on Encrypted Data:                     │
│  E(85) + E(90) + E(88) = E(263)                    │
│  (No decryption needed)                             │
│                                                      │
│  Selective Decryption:                              │
│  E(263) → 263 (only when authorized)               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Zama FHEVM Integration

### Library Setup

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import Zama FHEVM library
import "fhevm/lib/TFHE.sol";
import "fhevm/gateway/GatewayCaller.sol";

contract LiteratureReviewSystem is GatewayCaller {
    // Contract implementation
}
```

### Encrypted Data Types

```solidity
// Available FHE types from Zama

// Unsigned integers
euint8   encryptedTinyInt;   // 0-255
euint16  encryptedSmallInt;  // 0-65535
euint32  encryptedInt;       // 0-4294967295
euint64  encryptedBigInt;    // 0-18446744073709551615

// Boolean
ebool    encryptedBool;      // true/false

// Address
eaddress encryptedAddress;   // Ethereum address

// Example: Review scores
euint32 qualityScore;        // 1-100
euint32 originalityScore;    // 1-100
euint32 impactScore;         // 1-100
```

## Client-Side Encryption

### Setup FHEVM Instance

```javascript
// frontend/src/fhevm-setup.js
import { createInstance } from 'fhevmjs';

let fhevmInstance;

export async function initializeFHEVM(provider) {
    if (!fhevmInstance) {
        // Get network configuration
        const network = await provider.getNetwork();
        const chainId = network.chainId;

        // Create FHEVM instance
        fhevmInstance = await createInstance({
            chainId,
            publicKey: await getPublicKey(provider),
            gatewayUrl: process.env.GATEWAY_URL
        });
    }
    return fhevmInstance;
}

async function getPublicKey(provider) {
    const fhevmContract = new ethers.Contract(
        FHE_LIB_ADDRESS,
        FHE_LIB_ABI,
        provider
    );
    return await fhevmContract.getPublicKey();
}
```

### Encrypt Data Before Submission

```javascript
// Encrypt review scores
async function submitReview(workId, scores, comments) {
    const fhevm = await initializeFHEVM(provider);

    // Encrypt each score (1-100)
    const encryptedQuality = await fhevm.encrypt32(scores.quality);
    const encryptedOriginality = await fhevm.encrypt32(scores.originality);
    const encryptedImpact = await fhevm.encrypt32(scores.impact);

    // Submit to smart contract
    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
    );

    const tx = await contract.submitReview(
        workId,
        encryptedQuality,
        encryptedOriginality,
        encryptedImpact,
        comments  // Can also encrypt comments
    );

    await tx.wait();
    console.log('Review submitted with encrypted scores');
}
```

### Example: Full Encryption Flow

```javascript
// Complete example with error handling
async function encryptAndSubmitWork(workData) {
    try {
        // Initialize FHEVM
        const fhevm = await initializeFHEVM(provider);

        // Encrypt sensitive fields
        const encryptedTitle = await fhevm.encrypt32(
            stringToNumber(workData.title)
        );

        const encryptedAuthorName = await fhevm.encrypt32(
            stringToNumber(workData.authorName)
        );

        // Upload content to IPFS (unencrypted or encrypted separately)
        const ipfsHash = await uploadToIPFS(workData.fullContent);

        // Submit to blockchain
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
        );

        const tx = await contract.submitWork(
            encryptedTitle,
            encryptedAuthorName,
            workData.genre,
            ipfsHash
        );

        const receipt = await tx.wait();
        console.log('Work submitted:', receipt.transactionHash);

        return receipt;
    } catch (error) {
        console.error('Encryption failed:', error);
        throw error;
    }
}
```

## On-Chain FHE Operations

### Homomorphic Addition

```solidity
function aggregateScores(uint256 workId) internal returns (euint32) {
    euint32 totalScore = TFHE.asEuint32(0);

    // Get all reviews for this work
    for (uint256 i = 0; i < reviewerList.length; i++) {
        address reviewer = reviewerList[i];
        Review memory review = reviews[workId][reviewer];

        if (review.exists) {
            // Homomorphic addition
            euint32 reviewTotal = TFHE.add(
                review.encryptedQualityScore,
                TFHE.add(
                    review.encryptedOriginalityScore,
                    review.encryptedImpactScore
                )
            );

            totalScore = TFHE.add(totalScore, reviewTotal);
        }
    }

    return totalScore;
}
```

### Homomorphic Comparison

```solidity
function findWinner(Genre genre) internal returns (uint256) {
    euint32 highestScore = TFHE.asEuint32(0);
    uint256 winnerWorkId = 0;

    // Compare all works in the genre
    for (uint256 i = 1; i <= workCount; i++) {
        if (works[i].genre == genre) {
            euint32 workScore = aggregateScores(i);

            // Homomorphic comparison
            ebool isHigher = TFHE.gt(workScore, highestScore);

            // Conditional selection
            highestScore = TFHE.select(isHigher, workScore, highestScore);
            winnerWorkId = selectWinner(isHigher, i, winnerWorkId);
        }
    }

    return winnerWorkId;
}
```

### Access Control Lists

```solidity
function allowDecryption(uint256 workId, address user) external {
    require(
        msg.sender == works[workId].author ||
        msg.sender == admin,
        "Not authorized"
    );

    // Grant decryption permission
    TFHE.allow(works[workId].encryptedTitle, user);
    TFHE.allow(works[workId].encryptedAuthorName, user);
}

function revokeDecryption(uint256 workId, address user) external {
    require(msg.sender == admin, "Not authorized");

    // Revoke decryption permission
    TFHE.disallow(works[workId].encryptedTitle, user);
}
```

## Decryption

### Gateway-Based Decryption

```solidity
// Request decryption through Gateway
function requestDecryption(
    uint256 workId
) external returns (uint256 requestId) {
    require(
        TFHE.isAllowed(works[workId].encryptedTitle, msg.sender),
        "Not authorized to decrypt"
    );

    // Request decryption via Gateway
    euint32[] memory toDecrypt = new euint32[](2);
    toDecrypt[0] = works[workId].encryptedTitle;
    toDecrypt[1] = works[workId].encryptedAuthorName;

    requestId = Gateway.requestDecryption(
        toDecrypt,
        this.decryptionCallback.selector
    );

    decryptionRequests[requestId] = workId;
    return requestId;
}

// Callback function for decryption results
function decryptionCallback(
    uint256 requestId,
    uint256[] memory decryptedValues
) external onlyGateway {
    uint256 workId = decryptionRequests[requestId];

    // Store decrypted values
    decryptedTitles[workId] = decryptedValues[0];
    decryptedAuthors[workId] = decryptedValues[1];

    emit DecryptionCompleted(workId, msg.sender);
}
```

### Client-Side Decryption

```javascript
// Decrypt scores for display
async function decryptScore(encryptedScore, userPrivateKey) {
    const fhevm = await initializeFHEVM(provider);

    // Check permission
    const canDecrypt = await contract.canDecrypt(encryptedScore, userAddress);
    if (!canDecrypt) {
        throw new Error('Not authorized to decrypt');
    }

    // Decrypt using user's private key
    const plainScore = await fhevm.decrypt(
        encryptedScore,
        userPrivateKey
    );

    return plainScore;
}
```

## Security Considerations

### Key Management

```javascript
// Best practices for key management

// 1. Never store private keys in code
const privateKey = process.env.PRIVATE_KEY; // ❌ Bad

// 2. Use secure key storage
const privateKey = await secureStorage.getKey(); // ✅ Good

// 3. Implement key rotation
async function rotateEncryptionKeys() {
    const newKeyPair = await generateKeyPair();
    await reEncryptData(oldKey, newKeyPair);
    await secureStorage.storeKey(newKeyPair.private);
}
```

### Permission Management

```solidity
// Granular permission control
mapping(bytes32 => mapping(address => bool)) private permissions;

function grantPermission(
    euint32 encrypted,
    address user,
    uint256 expiryTime
) external {
    bytes32 dataId = keccak256(abi.encode(encrypted));
    permissions[dataId][user] = true;
    permissionExpiry[dataId][user] = expiryTime;

    TFHE.allow(encrypted, user);
}

function checkPermission(
    bytes32 dataId,
    address user
) internal view returns (bool) {
    return permissions[dataId][user] &&
           block.timestamp < permissionExpiry[dataId][user];
}
```

### Replay Attack Prevention

```solidity
// Include nonce in encrypted data
mapping(address => uint256) public nonces;

function submitWithNonce(
    euint32 encryptedData,
    uint256 nonce,
    bytes calldata signature
) external {
    require(nonce == nonces[msg.sender], "Invalid nonce");
    nonces[msg.sender]++;

    // Verify signature includes nonce
    bytes32 hash = keccak256(abi.encode(encryptedData, nonce));
    require(recoverSigner(hash, signature) == msg.sender, "Invalid signature");

    // Process encrypted data
}
```

## Performance Optimization

### Batch Operations

```solidity
// Batch encrypt multiple values
function batchEncrypt(
    uint32[] calldata values
) external returns (euint32[] memory) {
    euint32[] memory encrypted = new euint32[](values.length);

    for (uint256 i = 0; i < values.length; i++) {
        encrypted[i] = TFHE.asEuint32(values[i]);
    }

    return encrypted;
}
```

### Caching Results

```javascript
// Cache encrypted values to reduce re-encryption
const encryptionCache = new Map();

async function cachedEncrypt(value) {
    const cacheKey = `encrypt_${value}`;

    if (encryptionCache.has(cacheKey)) {
        return encryptionCache.get(cacheKey);
    }

    const encrypted = await fhevm.encrypt32(value);
    encryptionCache.set(cacheKey, encrypted);

    return encrypted;
}
```

## Testing FHE Operations

### Unit Tests

```javascript
describe("FHE Operations", function() {
    it("Should encrypt and decrypt correctly", async function() {
        const plainValue = 85;
        const encrypted = await fhevm.encrypt32(plainValue);

        // Submit to contract
        await contract.storeEncrypted(encrypted);

        // Decrypt
        const decrypted = await contract.decrypt(encrypted);
        expect(decrypted).to.equal(plainValue);
    });

    it("Should perform homomorphic addition", async function() {
        const e1 = await fhevm.encrypt32(85);
        const e2 = await fhevm.encrypt32(90);

        // Add on-chain
        await contract.addEncrypted(e1, e2);

        // Verify result
        const result = await contract.getResult();
        const decrypted = await fhevm.decrypt(result);
        expect(decrypted).to.equal(175);
    });
});
```

## Common Pitfalls

### 1. Forgetting Access Control

```solidity
// ❌ Bad: Anyone can decrypt
function getScore() external view returns (uint32) {
    return TFHE.decrypt(encryptedScore);
}

// ✅ Good: Check permissions
function getScore() external view returns (uint32) {
    require(TFHE.isAllowed(encryptedScore, msg.sender), "Not authorized");
    return TFHE.decrypt(encryptedScore);
}
```

### 2. Inefficient Comparisons

```solidity
// ❌ Bad: Decrypt then compare
uint32 score1 = TFHE.decrypt(e1);
uint32 score2 = TFHE.decrypt(e2);
bool isGreater = score1 > score2;

// ✅ Good: Compare encrypted values
ebool isGreater = TFHE.gt(e1, e2);
```

### 3. Unnecessary Decryption

```solidity
// ❌ Bad: Decrypt intermediate results
euint32 sum = TFHE.add(e1, e2);
uint32 plainSum = TFHE.decrypt(sum);  // Unnecessary!
euint32 final = TFHE.asEuint32(plainSum + 10);

// ✅ Good: Keep encrypted throughout
euint32 sum = TFHE.add(e1, e2);
euint32 final = TFHE.add(sum, TFHE.asEuint32(10));
```

## Further Reading

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [TFHE Library Reference](https://github.com/zama-ai/fhevm)
- [Architecture Guide](./ARCHITECTURE.md)
- [Security Best Practices](./SECURITY_GUIDE.md)

---

**Last Updated**: 2024
**Version**: 1.0.0
