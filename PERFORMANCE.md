# Performance Optimization Guide

## Overview

This document outlines the performance optimization strategies, gas optimization techniques, and monitoring tools used in the Literature Review System.

## ⚡ Gas Optimization

### Compiler Optimization

```javascript
// hardhat.config.js
solidity: {
  version: "0.8.24",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200  // Balanced for deployment and execution
    }
  }
}
```

**Optimizer Runs Explained:**
- **Lower (50-100)**: Cheaper deployment, higher execution cost
- **Medium (200)**: Balanced (recommended for most cases)
- **Higher (1000+)**: Expensive deployment, cheaper execution (for frequently called functions)

### Storage Optimization

#### 1. Variable Packing
```solidity
// ❌ Bad: Uses 3 storage slots
uint256 public currentSubmissionPeriod;  // Slot 0
uint256 public currentReviewPeriod;      // Slot 1
bool public isPaused;                    // Slot 2

// ✅ Good: Uses 1 storage slot
uint128 public currentSubmissionPeriod;  // Slot 0 (first half)
uint128 public currentReviewPeriod;      // Slot 0 (second half)
bool public isPaused;                    // Slot 0 (remaining space)
```

#### 2. Memory vs Storage
```solidity
// ❌ Expensive: Multiple SLOAD operations
function getWorkInfo(uint32 _period, uint32 _workId) external view {
    string memory title = submissions[_period][_workId].title;
    string memory author = submissions[_period][_workId].author;
    // ...
}

// ✅ Efficient: Single SLOAD operation
function getWorkInfo(uint32 _period, uint32 _workId) external view {
    LiteraryWork storage work = submissions[_period][_workId];
    string memory title = work.title;
    string memory author = work.author;
    // ...
}
```

### Function Optimization

#### 1. External vs Public
```solidity
// ❌ More expensive
function submitWork(string memory _title) public { }

// ✅ Less expensive (if only called externally)
function submitWork(string calldata _title) external { }
```

#### 2. Short-circuit Evaluation
```solidity
// ✅ Put cheaper checks first
require(msg.sender == owner && expensiveCheck(), "Failed");

// Better: Short-circuit if first condition fails
require(msg.sender == owner, "Not owner");
require(expensiveCheck(), "Expensive check failed");
```

#### 3. Loop Optimization
```solidity
// ❌ Unbounded loop - DoS risk
for (uint i = 0; i < users.length; i++) {
    // Process user
}

// ✅ Paginated approach
function processUsers(uint _start, uint _limit) external {
    uint end = _start + _limit;
    if (end > users.length) end = users.length;

    for (uint i = _start; i < end; i++) {
        // Process user
    }
}
```

### Events vs Storage

```solidity
// ❌ Expensive: Store historical data on-chain
struct HistoricalReview {
    uint256 timestamp;
    address reviewer;
    uint32 score;
}
HistoricalReview[] public history;

// ✅ Efficient: Use events for historical data
event ReviewSubmitted(
    uint256 indexed timestamp,
    address indexed reviewer,
    uint32 score
);
```

## 📊 Gas Monitoring

### Gas Reporter Configuration

```bash
# Enable gas reporting
REPORT_GAS=true npm test

# Output to file
GAS_REPORT_FILE=gas-report.txt npm test

# With USD prices
COINMARKETCAP_API_KEY=your_key npm run test:gas
```

### Gas Benchmarks

| Function | Gas Estimate | Optimization Status |
|----------|-------------|-------------------|
| `registerReviewer` | ~50,000 | ✅ Optimized |
| `approveReviewer` | ~45,000 | ✅ Optimized |
| `submitWork` | ~100,000 | ✅ Optimized |
| `submitReview` | ~150,000 | ⚠️ FHE overhead |
| `getSubmissionInfo` | ~5,000 | ✅ View function |

### Monitoring Commands

```bash
# Run tests with gas reporting
npm run test:gas

# Generate detailed gas report
npm run gas-report

# Check contract sizes
npm run size-contracts
```

## 🛡️ DoS Protection

### Rate Limiting

#### Time-based Restrictions
```solidity
// Period-based submission control
modifier duringSubmissionPeriod() {
    require(isSubmissionPeriodActive(), "Not during submission period");
    _;
}

// Prevents spam submissions
function isSubmissionPeriodActive() public view returns (bool) {
    uint256 dayOfMonth = ((block.timestamp / 86400) % 30) + 1;
    return dayOfMonth <= 14;
}
```

#### Batch Size Limits
```solidity
uint256 constant MAX_BATCH_SIZE = 50;

function processBatch(uint256[] calldata _ids) external {
    require(_ids.length <= MAX_BATCH_SIZE, "Batch too large");
    // Process batch
}
```

### Gas Limit Protection

```solidity
// ❌ Risk: Unbounded operation
function calculateAllScores() external {
    for (uint i = 0; i < allWorks.length; i++) {
        // Expensive calculation
    }
}

// ✅ Safe: Bounded operation
function calculateScores(uint _start, uint _count) external {
    uint end = _start + _count;
    require(end <= allWorks.length, "Out of bounds");

    for (uint i = _start; i < end; i++) {
        // Expensive calculation
    }
}
```

## 🔍 Code Splitting & Attack Surface

### Contract Modularity

```solidity
// ✅ Separate concerns to reduce attack surface
contract ReviewerManagement {
    // Reviewer-specific logic
}

contract SubmissionManagement {
    // Submission-specific logic
}

contract LiteratureReviewSystem is
    ReviewerManagement,
    SubmissionManagement
{
    // Core logic only
}
```

### Interface Minimization

```solidity
// ✅ Expose only necessary functions
interface ILiteratureReview {
    function submitWork(string calldata _title) external;
    function getSubmissionInfo(uint32 _period, uint32 _workId)
        external
        view
        returns (string memory, address);
}
```

## 📈 Performance Metrics

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Average Gas per Transaction | < 200,000 | TBD |
| Contract Size | < 24KB | TBD |
| Test Execution Time | < 60s | TBD |
| Coverage | > 70% | TBD |

### Monitoring Tools

```bash
# Check contract size
npm run size-contracts

# Output:
# ┌────────────────────────────┬──────────────────┐
# │ Contract Name              │ Size (KB)        │
# ├────────────────────────────┼──────────────────┤
# │ LiteratureReviewSystem     │ 18.5             │
# └────────────────────────────┴──────────────────┘
```

## 🔧 Optimization Tools

### 1. Hardhat Gas Reporter

```javascript
// hardhat.config.js
gasReporter: {
  enabled: process.env.REPORT_GAS === "true",
  currency: "USD",
  coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  showTimeSpent: true,
  showMethodSig: true
}
```

### 2. Contract Sizer

```javascript
// hardhat.config.js
contractSizer: {
  alphaSort: true,
  runOnCompile: false,
  strict: true
}
```

### 3. Solidity Optimizer

```javascript
// hardhat.config.js
solidity: {
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
      details: {
        yul: true,
        yulDetails: {
          stackAllocation: true,
          optimizerSteps: "dhfoDgvulfnTUtnIf"
        }
      }
    }
  }
}
```

## 🎯 Best Practices

### 1. Data Location

```solidity
// Use appropriate data locations
function processData(
    string calldata _input,      // External input
    uint256[] memory _temp,       // Temporary array
    mapping storage _permanent    // State variable
) external {
    // Implementation
}
```

### 2. Visibility Modifiers

```solidity
// Use most restrictive visibility
uint256 private internalCounter;    // Private state
uint256 internal inheritableData;   // Internal state
uint256 public publicCounter;       // Public read access
uint256 public constant MAX = 100;  // Compile-time constant
```

### 3. Immutable Variables

```solidity
// ✅ Use immutable for deploy-time constants
address public immutable owner;
uint256 public immutable deploymentTime;

constructor() {
    owner = msg.sender;
    deploymentTime = block.timestamp;
}
```

### 4. Unchecked Arithmetic

```solidity
// ✅ Use unchecked for safe operations
function increment(uint256 _counter) internal pure returns (uint256) {
    unchecked {
        return _counter + 1;  // Safe: will never overflow
    }
}
```

## 📊 Performance Testing

### Load Testing Script

```javascript
// test/performance/loadTest.js
describe("Performance Tests", function() {
  it("Should handle high submission volume", async function() {
    const startGas = await ethers.provider.getGasPrice();

    // Submit 100 works
    for (let i = 0; i < 100; i++) {
      await contract.submitWork(`Work ${i}`, "Author", "Genre", "Hash");
    }

    const endGas = await ethers.provider.getGasPrice();
    console.log(`Average gas per submission: ${(endGas - startGas) / 100}`);
  });
});
```

### Gas Benchmarking

```bash
# Run performance tests
npm run test:gas

# Generate detailed report
npm run gas-report > performance-report.txt
```

## 🔄 Continuous Optimization

### Regular Reviews

- **Weekly**: Review gas reports for anomalies
- **Monthly**: Analyze optimization opportunities
- **Quarterly**: Major optimization sprints

### Optimization Checklist

- [ ] Run gas reporter on all tests
- [ ] Check contract sizes
- [ ] Review storage layout
- [ ] Optimize loops and iterations
- [ ] Minimize external calls
- [ ] Use events for historical data
- [ ] Implement pagination
- [ ] Add batch processing
- [ ] Review function visibility
- [ ] Check for redundant operations

## 📚 Resources

### Tools
- [Hardhat Gas Reporter](https://github.com/cgewecke/hardhat-gas-reporter)
- [Solidity Optimizer](https://docs.soliditylang.org/en/latest/internals/optimizer.html)
- [Contract Size Check](https://github.com/ItsNickBarry/hardhat-contract-sizer)

### Guides
- [Gas Optimization Tips](https://mudit.blog/solidity-gas-optimization-tips/)
- [Solidity Patterns](https://fravoll.github.io/solidity-patterns/)
- [Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

**Last Updated**: 2025-10-28

**Performance Version**: 1.0.0
