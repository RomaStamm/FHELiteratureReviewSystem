# Refund & Timeout Protection Guide

**FHE Literature Review System**
**Complete Protection Mechanisms**

---

## 🛡️ Three-Layer Timeout Protection

### Layer 1: Decryption Failure Refund (1 Hour)

**Scenario**: Gateway service fails to decrypt scores within timeout window

**Timeline**:
```
T0: Reviewer submits review (stake locked)
T+1h: Timeout window expires
T+1h+: Reviewer can claim refund
```

**Functions**:
```solidity
function claimDecryptionFailureRefund(uint32 _period, uint32 _workId) external
```

**Eligibility**:
- ✅ Decryption request failed explicitly
- ✅ OR decryption timed out (>1 hour) and not completed
- ✅ Reviewer must have submitted review
- ✅ Review stake must be unclaimed

**Refund Amount**: Full review stake (REVIEW_STAKE + any additional amount)

**Events Emitted**:
```solidity
event RefundClaimed(address indexed user, uint256 amount, string reason);
event DecryptionFailureRefundIssued(address indexed reviewer, uint256 amount, uint256 requestId);
event AuditLog(string indexed action, address indexed user, uint256 timestamp, string details);
```

**Code Location**: `LiteratureReviewSystem.sol:607-632`

**Protection Against**:
- Gateway service outages
- Network failures
- Timeout attacks
- Lost decryption requests

---

### Layer 2: Submission Timeout Refund (7 Days)

**Scenario**: Author submitted work but it never gets reviewed

**Timeline**:
```
T0: Author submits work (deposit locked)
T+7d: Timeout window expires
T+7d+: Author can claim refund
```

**Functions**:
```solidity
function claimTimeoutRefund(uint32 _period, uint32 _workId) external
```

**Eligibility**:
- ✅ Work must be submitted
- ✅ Caller must be the original submitter
- ✅ 7+ days have passed since submission
- ✅ Work has not been reviewed
- ✅ Refund not already claimed

**Refund Amount**: Full submission deposit (SUBMISSION_FEE + any additional amount)

**Events Emitted**:
```solidity
event TimeoutRefundClaimed(address indexed user, uint32 indexed period, uint32 indexed workId, uint256 amount);
event SubmitterTimeoutRefundIssued(address indexed submitter, uint256 amount, uint32 period, uint32 workId);
event AuditLog(string indexed action, address indexed user, uint256 timestamp, string details);
```

**Code Location**: `LiteratureReviewSystem.sol:641-659`

**Protection Against**:
- Abandoned review processes
- Administrative delays
- Insufficient reviewer capacity
- Market conditions changing

---

### Layer 3: Reviewer Timeout Refund (7 Days)

**Scenario**: Reviewer submitted review but decryption fails or never completes

**Timeline**:
```
T0: Reviewer submits review (stake locked)
T+7d: Timeout window expires
T+7d+: Reviewer can claim refund (if decryption failed)
```

**Functions**:
```solidity
function claimReviewerTimeoutRefund(uint32 _period, uint32 _workId) external
```

**Eligibility**:
- ✅ Review must be submitted by caller
- ✅ 7+ days have passed since review submission
- ✅ Refund not already claimed
- ✅ Either:
  - No decryption request exists, OR
  - Decryption failed/didn't complete

**Refund Amount**: Full review stake (REVIEW_STAKE + any additional amount)

**Events Emitted**:
```solidity
event RefundClaimed(address indexed user, uint256 amount, string reason);
event ReviewerTimeoutRefundIssued(address indexed reviewer, uint256 amount, uint32 period, uint32 workId);
event AuditLog(string indexed action, address indexed user, uint256 timestamp, string details);
```

**Code Location**: `LiteratureReviewSystem.sol:668-691`

**Protection Against**:
- Decryption service failures
- Extended processing times
- Network congestion
- Administrative delays

---

## 📊 Refund Decision Tree

```
┌─────────────────────────────────────────────┐
│ User Claims Refund                          │
└─────────────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │ Are you a Reviewer?                 │
        └─────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │ YES                     │ NO
         ▼                         ▼
    ┌──────────────┐      ┌──────────────┐
    │ Reviewer     │      │ Submitter    │
    │ Refund Path  │      │ Refund Path  │
    └──────────────┘      └──────────────┘
         │                         │
         ▼                         ▼
    ┌──────────────────────┐  ┌──────────────────┐
    │ Did 7 days pass?     │  │ Did 7 days pass? │
    └──────────────────────┘  └──────────────────┘
         │                         │
    ┌────┴────┐              ┌────┴────┐
    │ YES     │ NO           │ YES     │ NO
    ▼         ▼              ▼         ▼
   ✅ CAN   ❌ WAIT      ✅ CAN   ❌ WAIT
   CLAIM   MORE TIME     CLAIM   MORE TIME
             │                     │
             └─ Check Decryption ──┘
                   Status
                   │
        ┌──────────┴──────────┐
        │ FAILED/TIMEOUT      │ PENDING
        ▼                     ▼
    ✅ CAN              ❌ MUST
    CLAIM              WAIT 7d
```

---

## 🔄 Refund Claim Flow

### For Reviewers (Decryption Failure)

**Step 1: Check Eligibility**
```javascript
// Check if refund is claimable
const isRefundable = await contract.isRefundClaimable(period, workId, reviewerAddress);
```

**Step 2: Claim Refund**
```solidity
function claimDecryptionFailureRefund(uint32 _period, uint32 _workId) external
```

**Requirements**:
- [ ] Decryption has failed OR
- [ ] 1+ hour has passed since decryption request AND decryption not completed
- [ ] You have submitted a review
- [ ] You haven't already claimed refund for this work
- [ ] Your stake amount is > 0

**Step 3: Verify**
- Transaction emits `DecryptionFailureRefundIssued` event
- Funds transferred via safe call
- Audit log recorded

### For Submitters (Timeout)

**Step 1: Check Eligibility**
```javascript
// Check if timeout refund is available
const canClaim = await contract.isRefundClaimable(period, workId, submitterAddress);
```

**Step 2: Claim Refund**
```solidity
function claimTimeoutRefund(uint32 _period, uint32 _workId) external
```

**Requirements**:
- [ ] 7+ days have passed since submission
- [ ] You are the original submitter
- [ ] Work hasn't been reviewed
- [ ] You haven't already claimed refund
- [ ] Deposit amount > 0

**Step 3: Verify**
- Transaction emits `TimeoutRefundClaimed` event
- Funds transferred via safe call
- Audit log recorded

### For Reviewers (Timeout)

**Step 1: Verify Decryption Status**
```javascript
const status = await contract.getDecryptionStatus(period, workId);
// failed = true OR (block.timestamp > requestTime + 1 hour AND !completed)
```

**Step 2: Claim Refund**
```solidity
function claimReviewerTimeoutRefund(uint32 _period, uint32 _workId) external
```

**Requirements**:
- [ ] 7+ days have passed since review submission
- [ ] You haven't already claimed refund
- [ ] Decryption has failed OR hasn't completed
- [ ] Your stake amount > 0

**Step 3: Verify**
- Transaction emits `ReviewerTimeoutRefundIssued` event
- Funds transferred via safe call
- Audit log recorded

---

## 📅 Timeline Examples

### Example 1: Successful Review (No Refund Needed)

```
Day 0, 10:00 AM
└─ Author submits work (deposit: 0.01 ETH)
   └─ Reviewer 1 submits review (stake: 0.005 ETH)
      └─ Reviewer 2 submits review (stake: 0.005 ETH)

Day 0, 4:00 PM
└─ Gateway decrypts successfully
   └─ Scores updated
      └─ Winner announced
         └─ Awards processed
            └─ Everyone happy, no refunds needed
```

### Example 2: Decryption Failure (Reviewer Refund)

```
Day 0, 10:00 AM
└─ Author submits work
   └─ Reviewer submits review (stake: 0.005 ETH)

Day 0, 4:00 PM
└─ Gateway decryption requested

Day 0, 5:15 PM
└─ Gateway service crashes
   └─ Decryption fails

Day 0, 5:20 PM
└─ Reviewer calls claimDecryptionFailureRefund()
   └─ Gets 0.005 ETH refunded immediately
      └─ Audit log: REFUND_DECRYPTION_FAILURE
```

### Example 3: Submission Timeout (Author Refund)

```
Day 0, 10:00 AM
└─ Author submits work (deposit: 0.01 ETH)
   └─ Waiting for review assignment...

Day 1 - 6
└─ No reviewers volunteer
   └─ Work sits unreviewed

Day 7, 10:01 AM
└─ Author calls claimTimeoutRefund()
   └─ Gets 0.01 ETH refunded
      └─ Audit log: TIMEOUT_REFUND_SUBMISSION
```

### Example 4: Review Timeout (Reviewer Refund)

```
Day 0, 10:00 AM
└─ Reviewer submits review (stake: 0.005 ETH)

Day 0, 2:00 PM
└─ Decryption request submitted

Day 0, 2:30 PM
└─ Gateway offline due to maintenance
   └─ Decryption never completes

Day 7, 10:01 AM
└─ Reviewer calls claimReviewerTimeoutRefund()
   └─ Gets 0.005 ETH refunded
      └─ Audit log: TIMEOUT_REFUND_REVIEW
```

---

## 🔐 Protection Guarantees

### Guarantee 1: Fund Recovery Timing

| Situation | Recovery Time | Method |
|-----------|--------------|--------|
| Decryption fails | Immediate | Call `claimDecryptionFailureRefund()` |
| Submission timeout | 7 days | Call `claimTimeoutRefund()` |
| Review timeout | 7 days | Call `claimReviewerTimeoutRefund()` |

### Guarantee 2: Refund Amounts

| Role | Amount | Trigger |
|------|--------|---------|
| Reviewer | Full stake | Decryption fails within 1h |
| Submitter | Full deposit | No review within 7 days |
| Reviewer | Full stake | No decryption within 7 days |

### Guarantee 3: Double-Claim Prevention

All refund functions check:
```solidity
require(!review.refundClaimed, "Already claimed refund");
```

Once claimed, `refundClaimed` flag is set permanently.

### Guarantee 4: Reentrancy Protection

All refund functions use:
```solidity
modifier noReentrant() {
    require(!locked, "Reentrant call");
    locked = true;
    _;
    locked = false;
}
```

---

## 📊 Refund Mechanism Audit Points

### Events to Monitor

1. **Decryption Failure**
   ```solidity
   event DecryptionFailed(uint32 indexed period, uint32 indexed workId, uint256 requestId);
   event DecryptionFailureRefundIssued(address indexed reviewer, uint256 amount, uint256 requestId);
   ```

2. **Timeout Events**
   ```solidity
   event TimeoutRefundClaimed(address indexed user, uint32 indexed period, uint32 indexed workId, uint256 amount);
   event ReviewerTimeoutRefundIssued(address indexed reviewer, uint256 amount, uint32 period, uint32 workId);
   event SubmitterTimeoutRefundIssued(address indexed submitter, uint256 amount, uint32 period, uint32 workId);
   ```

3. **General Refund**
   ```solidity
   event RefundClaimed(address indexed user, uint256 amount, string reason);
   ```

4. **Audit Log**
   ```solidity
   event AuditLog(string indexed action, address indexed user, uint256 timestamp, string details);
   // Actions: REFUND_DECRYPTION_FAILURE, TIMEOUT_REFUND_SUBMISSION, TIMEOUT_REFUND_REVIEW
   ```

### Monitoring Queries

```javascript
// Get all refund claims for a user
const refundEvents = await contract.queryFilter(
  contract.filters.RefundClaimed(userAddress),
  0,
  'latest'
);

// Get decryption failures
const failureEvents = await contract.queryFilter(
  contract.filters.DecryptionFailed(),
  0,
  'latest'
);

// Get timeout refunds for a period
const timeoutEvents = await contract.queryFilter(
  contract.filters.TimeoutRefundClaimed(null, periodNumber),
  0,
  'latest'
);
```

---

## 🎯 Best Practices

### For Users

1. **Monitor Your Transactions**
   - Keep track of submission and review timestamps
   - Set calendar reminders at 6.5 days

2. **Know Your Deadlines**
   - Decryption failure: Claim immediately (1 hour window)
   - Submission timeout: Wait 7 days
   - Review timeout: Wait 7 days

3. **Verify Status**
   ```javascript
   const status = await contract.getDecryptionStatus(period, workId);
   const isRefundable = await contract.isRefundClaimable(period, workId, userAddress);
   ```

4. **Claim Promptly**
   - Don't wait beyond timeout windows
   - Claim refunds as soon as eligible

### For Platform Operators

1. **Monitor Decryption Service**
   - Alert if requests exceed 30 minutes
   - Escalate if exceeding 1 hour
   - Pre-fail if service down >1 hour

2. **Track Unclaimed Refunds**
   - Generate reports of eligible refunds
   - Notify affected users
   - Ensure timely execution

3. **Audit Refund Claims**
   - Review AuditLog events regularly
   - Verify refund amounts match stakes
   - Check no duplicate claims

4. **Emergency Procedures**
   - Pause contract if refunds fail
   - Have backup transfer mechanism
   - Document all escalations

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] All three refund functions tested
- [ ] Timeout constants verified (1h, 7d)
- [ ] Reentrancy guards working
- [ ] Events emitting correctly
- [ ] Audit logs recording all actions
- [ ] Gas limits acceptable
- [ ] State transitions correct
- [ ] Double-claim prevention working
- [ ] Fund transfers safe (call vs send)
- [ ] Signature verification in callbacks
- [ ] Decryption proof validation
- [ ] Overflow protection enabled

---

**Document Version**: 1.0
**Last Updated**: November 26, 2024
**Status**: Complete & Ready for Deployment
