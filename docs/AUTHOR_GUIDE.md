# Author Guide

Welcome! This guide will help you submit your literary work to the FHE Literature Review System.

## Overview

The FHE Literature Review System allows you to submit literary works for confidential evaluation. Your identity and work details remain encrypted during the review process, ensuring fair and unbiased assessment.

## Getting Started

### Prerequisites

Before submitting your work, ensure you have:

1. **MetaMask Wallet**: Install from [metamask.io](https://metamask.io/)
2. **Sepolia ETH**: Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
3. **Your Literary Work**: Prepared manuscript ready for submission
4. **IPFS Account** (optional): For decentralized storage of full content

### Connect Your Wallet

1. Visit the application: https://fhe-literature-review-system.vercel.app/
2. Click "Connect Wallet"
3. Approve the connection in MetaMask
4. Ensure you're on Sepolia Testnet

## Submission Process

### Step 1: Prepare Your Manuscript

**Organize Your Work:**
- Complete manuscript in digital format
- Clear title and author information
- Genre classification
- Optional: Upload full text to IPFS

**Supported Genres:**
- Fiction (novels, short stories)
- Poetry (collections, individual poems)
- Drama (plays, screenplays)
- Non-Fiction (essays, memoirs)

### Step 2: Upload to IPFS (Optional)

If you want to store your full manuscript decentralized:

```bash
# Using IPFS Desktop or CLI
ipfs add manuscript.pdf

# Or use services like:
# - Pinata: https://pinata.cloud/
# - NFT.Storage: https://nft.storage/
# - Web3.Storage: https://web3.storage/
```

Save the IPFS hash (e.g., `QmX...`).

### Step 3: Submit Your Work

**On the Web Interface:**

1. Click "Submit New Work"
2. Fill in the submission form:

```
Title: Your Literary Work Title
Author Name: Your Name or Pseudonym
Genre: [Select from dropdown]
IPFS Hash: QmX... (if uploaded)
```

3. Click "Submit"
4. Confirm the transaction in MetaMask
5. Wait for confirmation

**What Gets Encrypted:**
- ✅ Your title (encrypted on-chain)
- ✅ Your author name (encrypted on-chain)
- ✅ Full manuscript (if on IPFS, hash stored)
- ❌ Genre (public, for categorization)
- ❌ Submission timestamp (public)

### Step 4: Confirmation

After successful submission:
- You'll receive a **Work ID**
- Transaction hash on Etherscan
- Status: "Awaiting Review"

**Save Your Work ID!** You'll need it to check status and results.

## During the Review Period

### What Happens?

```
1. Your work is assigned to expert reviewers
   └─> Reviewers access only encrypted metadata
       └─> Full content via IPFS (if provided)

2. Reviewers evaluate three dimensions:
   ├─> Quality (1-100)
   ├─> Originality (1-100)
   └─> Impact (1-100)

3. Reviews are submitted encrypted
   └─> Scores remain confidential
       └─> No reviewer sees others' scores

4. System aggregates using FHE
   └─> Mathematical computation on encrypted data
       └─> Winner determined without decryption
```

### Check Your Submission Status

```javascript
// Via web interface
1. Connect wallet
2. Click "My Submissions"
3. View status for each work

// Status indicators:
- 🟡 Submitted: Awaiting reviews
- 🔵 Under Review: Being evaluated
- 🟢 Reviewed: Evaluation complete
- 🏆 Winner: Congratulations!
```

### What You Can See

During review period:
- ✅ Submission confirmation
- ✅ Number of reviews received
- ✅ Your work ID and genre
- ❌ Individual review scores (encrypted)
- ❌ Reviewer identities (anonymous)
- ❌ Preliminary rankings

## After Announcement

### Results Released

Once the announcement period begins:
- 🏆 Winners revealed by genre
- 📊 Aggregate scores published
- 🎖️ Recognition and certificates
- 🔒 Individual review scores remain private

### If You Win

Congratulations! Winners receive:
- Public recognition on platform
- Aggregate score (total of all reviews)
- Optional: Certificate of achievement
- Your work showcased (with permission)

### If You Don't Win

Don't be discouraged:
- Encrypted reviews protect your privacy
- No public ranking of non-winners
- Participate again in future rounds
- Learn and improve from the experience

## Privacy Guarantees

### What's Protected

**During Submission:**
- Your title is encrypted
- Your author name is encrypted
- Full manuscript content secured

**During Review:**
- Reviewers don't know author identity
- Your work evaluated blind
- No way to trace submission to you

**During Calculation:**
- Scores computed without decryption
- Winner determined mathematically
- Individual reviews never revealed

**After Announcement:**
- Only winners publicly known
- Review details remain confidential
- Option to remain pseudonymous

### What's Public

- Your wallet address (as author)
- Genre category
- Submission timestamp
- If you win: aggregate score
- IPFS hash (if provided)

## Best Practices

### 1. Protect Your Identity

```
If you want complete anonymity:
- Use a fresh wallet address
- Don't reuse known addresses
- Use pseudonym as author name
- Don't include identifying information in title
```

### 2. Backup Your Work

```
Always maintain backup copies:
- Original manuscript file
- IPFS hash
- Work ID from submission
- Transaction hash
```

### 3. IPFS Considerations

```
If using IPFS:
- ✅ Pin your content (ensure availability)
- ✅ Use reliable pinning service
- ✅ Test hash retrieval before submitting
- ❌ Don't include personal metadata in files
```

### 4. Timing Your Submission

```
Submit early in the submission period:
- Gives reviewers more time
- Avoids last-minute technical issues
- Shows commitment and professionalism
```

## Troubleshooting

### "Transaction Failed"

**Possible causes:**
- Insufficient Sepolia ETH
- Network congestion
- Wrong network (not Sepolia)

**Solutions:**
- Get more test ETH from faucet
- Wait and retry
- Check MetaMask network settings

### "Submission Not Appearing"

**Possible causes:**
- Transaction still pending
- Browser cache issues
- Wallet not connected

**Solutions:**
- Wait for transaction confirmation
- Refresh page and reconnect wallet
- Check Etherscan for transaction status

### "Cannot Access IPFS Content"

**Possible causes:**
- Content not pinned
- IPFS gateway issues
- Incorrect hash

**Solutions:**
- Verify hash is correct
- Try different IPFS gateway
- Ensure content is pinned

## FAQ

### Q: How much does it cost to submit?

**A:** On Sepolia testnet, you only pay gas fees (very small amount of test ETH). On mainnet, expect standard Ethereum gas costs.

### Q: Can I submit multiple works?

**A:** Yes! You can submit multiple works in different genres or even the same genre.

### Q: Can I update my submission?

**A:** No, submissions are immutable once confirmed. Ensure everything is correct before submitting.

### Q: Who are the reviewers?

**A:** Expert reviewers authorized by the administrator. Their identities are protected during the review process.

### Q: How long does review take?

**A:** Depends on the review period configured by administrators. Check the platform for current timeline.

### Q: What if I find a plagiarized work?

**A:** Report to administrators via the platform or GitHub issues. Include work ID and evidence.

### Q: Can I withdraw my submission?

**A:** Once submitted to blockchain, it's permanent. Choose carefully before submitting.

## Support

Need help?

- **Documentation**: [Full docs](./README.md)
- **Issues**: [GitHub Issues](https://github.com/RomaStamm/FHELiteratureReviewSystem/issues)
- **Live Demo**: https://fhe-literature-review-system.vercel.app/

## Next Steps

After submitting your work:

1. **Monitor Status**: Check regularly for updates
2. **Stay Informed**: Watch for announcement period
3. **Plan Next Submission**: Prepare for future rounds
4. **Share Experience**: Help other authors understand the process

---

**Good luck with your submission! May your literary talent shine through in the confidential review process.**

📚 [Back to Documentation](./README.md) | 🔍 [Reviewer Guide](./REVIEWER_GUIDE.md) | ⚙️ [Admin Guide](./ADMIN_GUIDE.md)
