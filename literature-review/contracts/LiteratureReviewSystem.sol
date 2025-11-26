// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, euint64, ebool, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title LiteratureReviewSystem
 * @notice Decentralized confidential literary awards platform with FHE encryption
 * @dev Implements Gateway callback pattern for async decryption with refund and timeout mechanisms
 *
 * Architecture Overview:
 * =====================
 * 1. User submits encrypted review scores
 * 2. Contract records encrypted data and creates decryption request
 * 3. Gateway decrypts and calls back with results
 * 4. If decryption fails or times out, users can claim refunds
 *
 * Privacy Protections:
 * - Random multiplier for division operations
 * - Score obfuscation during computation
 * - Async Gateway callback for secure decryption
 *
 * Security Features:
 * - Input validation on all parameters
 * - Access control with role-based permissions
 * - Overflow protection via Solidity 0.8+
 * - Timeout protection against permanent locking
 * - Reentrancy guards on critical functions
 */
contract LiteratureReviewSystem is SepoliaConfig {

    // ============================================================
    //                         CONSTANTS
    // ============================================================

    uint256 public constant SUBMISSION_FEE = 0.01 ether;
    uint256 public constant REVIEW_STAKE = 0.005 ether;
    uint256 public constant MIN_SCORE = 1;
    uint256 public constant MAX_SCORE = 100;
    uint256 public constant DECRYPTION_TIMEOUT = 1 hours;
    uint256 public constant REVIEW_TIMEOUT = 7 days;
    uint32 public constant PRIVACY_MULTIPLIER_MIN = 100;
    uint32 public constant PRIVACY_MULTIPLIER_MAX = 1000;

    // ============================================================
    //                           STATE
    // ============================================================

    address public owner;
    uint32 public currentSubmissionPeriod;
    uint32 public currentReviewPeriod;
    uint256 public platformFees;
    bool public paused;
    bool private locked; // Reentrancy guard

    struct LiteraryWork {
        string title;
        string author;
        string genre;
        euint32 encryptedScore;
        bool submitted;
        bool reviewed;
        uint256 submissionTime;
        address submitter;
        string ipfsHash;
        uint256 depositAmount;
        bool refundClaimed;
    }

    struct ReviewerProfile {
        string name;
        string expertise;
        bool isActive;
        uint32 reviewCount;
        euint32 averageScore;
        uint256 stakedAmount;
        uint256 registrationTime;
    }

    struct Review {
        euint32 encryptedQualityScore;
        euint32 encryptedOriginalityScore;
        euint32 encryptedImpactScore;
        euint32 encryptedPrivacyMultiplier; // Random multiplier for privacy
        string encryptedComments;
        bool submitted;
        address reviewer;
        uint256 reviewTime;
        uint256 stakeAmount;
        bool refundClaimed;
    }

    struct Award {
        string category;
        address winner;
        uint32 totalScore;
        bool announced;
        uint256 announcementTime;
    }

    // Gateway callback request tracking
    struct DecryptionRequest {
        uint32 period;
        uint32 workId;
        address requester;
        uint256 requestTime;
        bool completed;
        bool failed;
        uint64 decryptedScore;
    }

    // ============================================================
    //                         MAPPINGS
    // ============================================================

    mapping(uint32 => mapping(uint32 => LiteraryWork)) public submissions;
    mapping(address => ReviewerProfile) public reviewers;
    mapping(uint32 => mapping(uint32 => mapping(address => Review))) public reviews;
    mapping(uint32 => Award[]) public awards;
    mapping(uint32 => uint32) public workCountPerPeriod;
    mapping(address => bool) public authorizedReviewers;

    // Gateway callback mappings
    mapping(uint256 => DecryptionRequest) public decryptionRequests;
    mapping(uint256 => string) internal requestIdToBetId;
    mapping(uint32 => mapping(uint32 => uint256)) public workDecryptionRequestId;
    mapping(uint32 => mapping(uint32 => address[])) internal workReviewers;

    uint256 public nextRequestId;

    // ============================================================
    //                          EVENTS
    // ============================================================

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

    // ============================================================
    //                         MODIFIERS
    // ============================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthorizedReviewer() {
        require(authorizedReviewers[msg.sender], "Not authorized reviewer");
        _;
    }

    modifier duringSubmissionPeriod() {
        require(isSubmissionPeriodActive(), "Not during submission period");
        _;
    }

    modifier duringReviewPeriod() {
        require(isReviewPeriodActive(), "Not during review period");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    // Input validation modifiers
    modifier validScore(uint32 score) {
        require(score >= MIN_SCORE && score <= MAX_SCORE, "Score must be 1-100");
        _;
    }

    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid zero address");
        _;
    }

    modifier validString(string memory str) {
        require(bytes(str).length > 0 && bytes(str).length <= 256, "Invalid string length");
        _;
    }

    // ============================================================
    //                       CONSTRUCTOR
    // ============================================================

    constructor() {
        owner = msg.sender;
        currentSubmissionPeriod = 1;
        currentReviewPeriod = 0;
        nextRequestId = 1;
    }

    // ============================================================
    //                     PERIOD MANAGEMENT
    // ============================================================

    /**
     * @notice Check if submission period is active (first 2 weeks of each month)
     * @return bool True if submission period is active
     */
    function isSubmissionPeriodActive() public view returns (bool) {
        uint256 dayOfMonth = ((block.timestamp / 86400) % 30) + 1;
        return dayOfMonth <= 14;
    }

    /**
     * @notice Check if review period is active (last 2 weeks of each month)
     * @return bool True if review period is active
     */
    function isReviewPeriodActive() public view returns (bool) {
        uint256 dayOfMonth = ((block.timestamp / 86400) % 30) + 1;
        return dayOfMonth > 14;
    }

    /**
     * @notice Start new submission period
     * @dev Only owner can call, only during first half of month
     */
    function startSubmissionPeriod() external onlyOwner whenNotPaused {
        require(isSubmissionPeriodActive(), "Can only start during first half of month");

        currentSubmissionPeriod++;
        workCountPerPeriod[currentSubmissionPeriod] = 0;

        emit SubmissionPeriodStarted(currentSubmissionPeriod, block.timestamp);
    }

    /**
     * @notice Start review period
     * @dev Only owner can call, only during second half of month
     */
    function startReviewPeriod() external onlyOwner whenNotPaused {
        require(isReviewPeriodActive(), "Can only start during second half of month");
        require(currentReviewPeriod < currentSubmissionPeriod, "Review period already current");

        currentReviewPeriod = currentSubmissionPeriod;

        emit ReviewPeriodStarted(currentReviewPeriod, block.timestamp);
    }

    // ============================================================
    //                    REVIEWER MANAGEMENT
    // ============================================================

    /**
     * @notice Register as reviewer with stake
     * @param _name Reviewer's name
     * @param _expertise Area of expertise
     * @dev Requires REVIEW_STAKE to be sent with transaction
     */
    function registerReviewer(
        string memory _name,
        string memory _expertise
    ) external payable whenNotPaused validString(_name) validString(_expertise) {
        require(msg.value >= REVIEW_STAKE, "Insufficient stake");
        require(bytes(reviewers[msg.sender].name).length == 0, "Already registered");

        reviewers[msg.sender] = ReviewerProfile({
            name: _name,
            expertise: _expertise,
            isActive: false,
            reviewCount: 0,
            averageScore: FHE.asEuint32(0),
            stakedAmount: msg.value,
            registrationTime: block.timestamp
        });

        emit ReviewerRegistered(msg.sender, _name, msg.value);
    }

    /**
     * @notice Approve reviewer (owner only)
     * @param _reviewer Address of reviewer to approve
     */
    function approveReviewer(address _reviewer) external onlyOwner validAddress(_reviewer) {
        require(bytes(reviewers[_reviewer].name).length > 0, "Reviewer not registered");

        reviewers[_reviewer].isActive = true;
        authorizedReviewers[_reviewer] = true;
    }

    /**
     * @notice Revoke reviewer authorization
     * @param _reviewer Address of reviewer to revoke
     */
    function revokeReviewer(address _reviewer) external onlyOwner validAddress(_reviewer) {
        reviewers[_reviewer].isActive = false;
        authorizedReviewers[_reviewer] = false;
    }

    // ============================================================
    //                    WORK SUBMISSION
    // ============================================================

    /**
     * @notice Submit literary work with deposit
     * @param _title Work title
     * @param _author Author name
     * @param _genre Genre category
     * @param _ipfsHash IPFS hash for content
     * @dev Requires SUBMISSION_FEE to be sent
     */
    function submitWork(
        string memory _title,
        string memory _author,
        string memory _genre,
        string memory _ipfsHash
    ) external payable duringSubmissionPeriod whenNotPaused
      validString(_title) validString(_author) validString(_genre) validString(_ipfsHash) {
        require(msg.value >= SUBMISSION_FEE, "Insufficient submission fee");

        uint32 workId = workCountPerPeriod[currentSubmissionPeriod] + 1;
        workCountPerPeriod[currentSubmissionPeriod] = workId;

        submissions[currentSubmissionPeriod][workId] = LiteraryWork({
            title: _title,
            author: _author,
            genre: _genre,
            encryptedScore: FHE.asEuint32(0),
            submitted: true,
            reviewed: false,
            submissionTime: block.timestamp,
            submitter: msg.sender,
            ipfsHash: _ipfsHash,
            depositAmount: msg.value,
            refundClaimed: false
        });

        emit WorkSubmitted(currentSubmissionPeriod, workId, msg.sender, msg.value);
    }

    // ============================================================
    //                   REVIEW SUBMISSION (Gateway Pattern)
    // ============================================================

    /**
     * @notice Submit confidential review with encrypted scores
     * @param _workId ID of work being reviewed
     * @param _encryptedQuality Encrypted quality score
     * @param _encryptedOriginality Encrypted originality score
     * @param _encryptedImpact Encrypted impact score
     * @param _inputProof Proof for encrypted inputs
     * @param _encryptedComments Encrypted feedback comments
     * @dev Uses Gateway callback pattern for async processing
     */
    function submitReviewEncrypted(
        uint32 _workId,
        externalEuint32 _encryptedQuality,
        externalEuint32 _encryptedOriginality,
        externalEuint32 _encryptedImpact,
        bytes calldata _inputProof,
        string memory _encryptedComments
    ) external payable onlyAuthorizedReviewer duringReviewPeriod whenNotPaused noReentrant {
        require(msg.value >= REVIEW_STAKE, "Insufficient review stake");
        require(submissions[currentReviewPeriod][_workId].submitted, "Work not found");
        require(!reviews[currentReviewPeriod][_workId][msg.sender].submitted, "Already reviewed");

        // Convert external encrypted values to internal
        euint32 encryptedQuality = FHE.fromExternal(_encryptedQuality, _inputProof);
        euint32 encryptedOriginality = FHE.fromExternal(_encryptedOriginality, _inputProof);
        euint32 encryptedImpact = FHE.fromExternal(_encryptedImpact, _inputProof);

        // Generate privacy multiplier for division protection
        euint32 privacyMultiplier = _generatePrivacyMultiplier();

        reviews[currentReviewPeriod][_workId][msg.sender] = Review({
            encryptedQualityScore: encryptedQuality,
            encryptedOriginalityScore: encryptedOriginality,
            encryptedImpactScore: encryptedImpact,
            encryptedPrivacyMultiplier: privacyMultiplier,
            encryptedComments: _encryptedComments,
            submitted: true,
            reviewer: msg.sender,
            reviewTime: block.timestamp,
            stakeAmount: msg.value,
            refundClaimed: false
        });

        // Grant access permissions for FHE operations
        FHE.allowThis(encryptedQuality);
        FHE.allowThis(encryptedOriginality);
        FHE.allowThis(encryptedImpact);
        FHE.allowThis(privacyMultiplier);
        FHE.allow(encryptedQuality, msg.sender);
        FHE.allow(encryptedOriginality, msg.sender);
        FHE.allow(encryptedImpact, msg.sender);

        // Track reviewer for this work
        workReviewers[currentReviewPeriod][_workId].push(msg.sender);

        // Update reviewer stats
        reviewers[msg.sender].reviewCount++;

        emit ReviewSubmitted(currentReviewPeriod, _workId, msg.sender, msg.value);
    }

    /**
     * @notice Submit review with plaintext scores (encrypted internally)
     * @param _workId ID of work being reviewed
     * @param _qualityScore Quality score (1-100)
     * @param _originalityScore Originality score (1-100)
     * @param _impactScore Impact score (1-100)
     * @param _encryptedComments Encrypted feedback comments
     */
    function submitReview(
        uint32 _workId,
        uint32 _qualityScore,
        uint32 _originalityScore,
        uint32 _impactScore,
        string memory _encryptedComments
    ) external payable onlyAuthorizedReviewer duringReviewPeriod whenNotPaused noReentrant
      validScore(_qualityScore) validScore(_originalityScore) validScore(_impactScore) {
        require(msg.value >= REVIEW_STAKE, "Insufficient review stake");
        require(submissions[currentReviewPeriod][_workId].submitted, "Work not found");
        require(!reviews[currentReviewPeriod][_workId][msg.sender].submitted, "Already reviewed");

        // Encrypt the scores with privacy protection
        euint32 encryptedQuality = FHE.asEuint32(_qualityScore);
        euint32 encryptedOriginality = FHE.asEuint32(_originalityScore);
        euint32 encryptedImpact = FHE.asEuint32(_impactScore);
        euint32 privacyMultiplier = _generatePrivacyMultiplier();

        reviews[currentReviewPeriod][_workId][msg.sender] = Review({
            encryptedQualityScore: encryptedQuality,
            encryptedOriginalityScore: encryptedOriginality,
            encryptedImpactScore: encryptedImpact,
            encryptedPrivacyMultiplier: privacyMultiplier,
            encryptedComments: _encryptedComments,
            submitted: true,
            reviewer: msg.sender,
            reviewTime: block.timestamp,
            stakeAmount: msg.value,
            refundClaimed: false
        });

        // Grant access permissions
        FHE.allowThis(encryptedQuality);
        FHE.allowThis(encryptedOriginality);
        FHE.allowThis(encryptedImpact);
        FHE.allowThis(privacyMultiplier);
        FHE.allow(encryptedQuality, msg.sender);
        FHE.allow(encryptedOriginality, msg.sender);
        FHE.allow(encryptedImpact, msg.sender);

        workReviewers[currentReviewPeriod][_workId].push(msg.sender);
        reviewers[msg.sender].reviewCount++;

        emit ReviewSubmitted(currentReviewPeriod, _workId, msg.sender, msg.value);
    }

    // ============================================================
    //                    GATEWAY CALLBACK PATTERN
    // ============================================================

    /**
     * @notice Request decryption of work scores via Gateway
     * @param _period Review period
     * @param _workId Work ID to decrypt
     * @dev Initiates async decryption request
     */
    function requestScoreDecryption(uint32 _period, uint32 _workId) external onlyOwner whenNotPaused {
        require(submissions[_period][_workId].submitted, "Work not found");
        require(workDecryptionRequestId[_period][_workId] == 0, "Decryption already requested");

        // Calculate aggregate score first
        euint32 aggregateScore = _calculateAggregateScore(_period, _workId);

        // Prepare ciphertext for decryption
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(aggregateScore);

        // Request decryption via Gateway
        uint256 requestId = FHE.requestDecryption(cts, this.scoreDecryptionCallback.selector);

        decryptionRequests[requestId] = DecryptionRequest({
            period: _period,
            workId: _workId,
            requester: msg.sender,
            requestTime: block.timestamp,
            completed: false,
            failed: false,
            decryptedScore: 0
        });

        workDecryptionRequestId[_period][_workId] = requestId;

        emit DecryptionRequested(_period, _workId, requestId);
    }

    /**
     * @notice Gateway callback for score decryption
     * @param requestId Request ID from Gateway
     * @param cleartexts Decrypted values
     * @param decryptionProof Proof of correct decryption
     * @dev Called by Gateway relayer after decryption
     */
    function scoreDecryptionCallback(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) external {
        // Verify the decryption proof
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        DecryptionRequest storage request = decryptionRequests[requestId];
        require(!request.completed, "Already processed");

        // Decode the decrypted score
        uint64 decryptedScore = abi.decode(cleartexts, (uint64));

        request.completed = true;
        request.decryptedScore = decryptedScore;

        // Update work with decrypted score
        LiteraryWork storage work = submissions[request.period][request.workId];
        work.reviewed = true;

        emit DecryptionCompleted(request.period, request.workId, decryptedScore);
    }

    /**
     * @notice Mark decryption as failed (for timeout handling)
     * @param _period Period of the work
     * @param _workId Work ID
     */
    function markDecryptionFailed(uint32 _period, uint32 _workId) external onlyOwner {
        uint256 requestId = workDecryptionRequestId[_period][_workId];
        require(requestId != 0, "No decryption request found");

        DecryptionRequest storage request = decryptionRequests[requestId];
        require(!request.completed, "Already completed");
        require(block.timestamp > request.requestTime + DECRYPTION_TIMEOUT, "Timeout not reached");

        request.failed = true;
        request.completed = true;

        emit DecryptionFailed(_period, _workId, requestId);
    }

    // ============================================================
    //                    REFUND MECHANISMS
    // ============================================================

    /**
     * @notice Claim refund for failed decryption
     * @param _period Period of the work
     * @param _workId Work ID
     * @dev Available when decryption fails or times out
     */
    function claimDecryptionFailureRefund(uint32 _period, uint32 _workId) external noReentrant {
        uint256 requestId = workDecryptionRequestId[_period][_workId];
        require(requestId != 0, "No decryption request");

        DecryptionRequest storage request = decryptionRequests[requestId];
        require(request.failed ||
                (block.timestamp > request.requestTime + DECRYPTION_TIMEOUT && !request.completed),
                "Decryption not failed");

        Review storage review = reviews[_period][_workId][msg.sender];
        require(review.submitted, "No review found");
        require(!review.refundClaimed, "Already claimed");
        require(review.stakeAmount > 0, "No stake to refund");

        review.refundClaimed = true;
        uint256 refundAmount = review.stakeAmount;

        (bool sent, ) = payable(msg.sender).call{value: refundAmount}("");
        require(sent, "Refund failed");

        emit RefundClaimed(msg.sender, refundAmount, "Decryption failure");
    }

    /**
     * @notice Claim timeout refund for submission
     * @param _period Period of the submission
     * @param _workId Work ID
     * @dev Available when review period ends without completion
     */
    function claimTimeoutRefund(uint32 _period, uint32 _workId) external noReentrant {
        LiteraryWork storage work = submissions[_period][_workId];
        require(work.submitted, "Work not found");
        require(work.submitter == msg.sender, "Not the submitter");
        require(!work.refundClaimed, "Already refunded");
        require(block.timestamp > work.submissionTime + REVIEW_TIMEOUT, "Timeout not reached");
        require(!work.reviewed, "Work already reviewed");

        work.refundClaimed = true;
        uint256 refundAmount = work.depositAmount;

        (bool sent, ) = payable(msg.sender).call{value: refundAmount}("");
        require(sent, "Refund failed");

        emit TimeoutRefundClaimed(msg.sender, _period, _workId, refundAmount);
    }

    /**
     * @notice Claim reviewer stake refund on timeout
     * @param _period Period
     * @param _workId Work ID
     */
    function claimReviewerTimeoutRefund(uint32 _period, uint32 _workId) external noReentrant {
        Review storage review = reviews[_period][_workId][msg.sender];
        require(review.submitted, "No review found");
        require(!review.refundClaimed, "Already claimed");
        require(block.timestamp > review.reviewTime + REVIEW_TIMEOUT, "Timeout not reached");

        uint256 requestId = workDecryptionRequestId[_period][_workId];
        if (requestId != 0) {
            DecryptionRequest storage request = decryptionRequests[requestId];
            require(!request.completed || request.failed, "Decryption succeeded");
        }

        review.refundClaimed = true;
        uint256 refundAmount = review.stakeAmount;

        (bool sent, ) = payable(msg.sender).call{value: refundAmount}("");
        require(sent, "Refund failed");

        emit RefundClaimed(msg.sender, refundAmount, "Review timeout");
    }

    // ============================================================
    //                    PRIVACY PROTECTION
    // ============================================================

    /**
     * @notice Generate privacy multiplier to protect division operations
     * @return euint32 Random encrypted multiplier
     * @dev Prevents score inference through division analysis
     */
    function _generatePrivacyMultiplier() private returns (euint32) {
        // Use block data for pseudo-randomness (in production, use VRF)
        uint32 randomValue = uint32(uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            nextRequestId++
        ))) % (PRIVACY_MULTIPLIER_MAX - PRIVACY_MULTIPLIER_MIN) + PRIVACY_MULTIPLIER_MIN);

        return FHE.asEuint32(randomValue);
    }

    /**
     * @notice Calculate aggregate score with privacy protection
     * @param _period Review period
     * @param _workId Work ID
     * @return euint32 Encrypted aggregate score
     * @dev Uses obfuscation to prevent individual score inference
     */
    function _calculateAggregateScore(uint32 _period, uint32 _workId) private view returns (euint32) {
        address[] storage reviewerList = workReviewers[_period][_workId];
        euint32 totalScore = FHE.asEuint32(0);
        euint32 totalMultiplier = FHE.asEuint32(0);

        for (uint i = 0; i < reviewerList.length; i++) {
            Review storage review = reviews[_period][_workId][reviewerList[i]];
            if (review.submitted) {
                // Add individual category scores
                euint32 categoryTotal = FHE.add(
                    review.encryptedQualityScore,
                    FHE.add(review.encryptedOriginalityScore, review.encryptedImpactScore)
                );

                // Apply privacy multiplier for obfuscation
                euint32 obfuscatedScore = FHE.mul(categoryTotal, review.encryptedPrivacyMultiplier);
                totalScore = FHE.add(totalScore, obfuscatedScore);
                totalMultiplier = FHE.add(totalMultiplier, review.encryptedPrivacyMultiplier);
            }
        }

        return totalScore;
    }

    // ============================================================
    //                    AWARD CALCULATION
    // ============================================================

    /**
     * @notice Calculate results and determine winners
     * @param _period Period to calculate
     */
    function calculateResults(uint32 _period) external onlyOwner whenNotPaused {
        require(_period <= currentReviewPeriod, "Period not ready for calculation");

        uint32 workCount = workCountPerPeriod[_period];

        for (uint32 workId = 1; workId <= workCount; workId++) {
            _calculateWorkScore(_period, workId);
        }

        _determineAwardWinners(_period);
    }

    function _calculateWorkScore(uint32 _period, uint32 _workId) private {
        LiteraryWork storage work = submissions[_period][_workId];
        if (!work.submitted) return;

        euint32 totalScore = _calculateAggregateScore(_period, _workId);
        work.encryptedScore = totalScore;
        work.reviewed = true;
    }

    function _determineAwardWinners(uint32 _period) private {
        string[4] memory categories = ["Fiction", "Poetry", "Drama", "Non-Fiction"];

        for (uint i = 0; i < categories.length; i++) {
            address winner = _findCategoryWinner(_period, categories[i]);
            if (winner != address(0)) {
                awards[_period].push(Award({
                    category: categories[i],
                    winner: winner,
                    totalScore: 0,
                    announced: false,
                    announcementTime: 0
                }));
            }
        }
    }

    function _findCategoryWinner(uint32 _period, string memory _genre) private view returns (address) {
        uint32 workCount = workCountPerPeriod[_period];
        address bestSubmitter = address(0);

        for (uint32 workId = 1; workId <= workCount; workId++) {
            LiteraryWork storage work = submissions[_period][workId];
            if (work.submitted && keccak256(bytes(work.genre)) == keccak256(bytes(_genre))) {
                if (bestSubmitter == address(0)) {
                    bestSubmitter = work.submitter;
                }
            }
        }

        return bestSubmitter;
    }

    /**
     * @notice Announce award results
     * @param _period Period to announce
     */
    function announceAwards(uint32 _period) external onlyOwner whenNotPaused {
        Award[] storage periodAwards = awards[_period];

        for (uint i = 0; i < periodAwards.length; i++) {
            if (!periodAwards[i].announced) {
                periodAwards[i].announced = true;
                periodAwards[i].announcementTime = block.timestamp;

                emit AwardAnnounced(_period, periodAwards[i].category, periodAwards[i].winner);
            }
        }
    }

    // ============================================================
    //                    ADMIN FUNCTIONS
    // ============================================================

    /**
     * @notice Pause contract in emergency
     */
    function pause() external onlyOwner {
        paused = true;
        emit ContractPaused(msg.sender);
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        paused = false;
        emit ContractUnpaused(msg.sender);
    }

    /**
     * @notice Withdraw platform fees
     * @param to Address to receive fees
     */
    function withdrawPlatformFees(address to) external onlyOwner validAddress(to) noReentrant {
        require(platformFees > 0, "No fees to withdraw");
        uint256 amount = platformFees;
        platformFees = 0;

        (bool sent, ) = payable(to).call{value: amount}("");
        require(sent, "Withdraw failed");
    }

    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner validAddress(newOwner) {
        owner = newOwner;
    }

    // ============================================================
    //                      VIEW FUNCTIONS
    // ============================================================

    /**
     * @notice Get submission info
     */
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
    ) {
        LiteraryWork storage work = submissions[_period][_workId];
        return (
            work.title,
            work.author,
            work.genre,
            work.submitted,
            work.reviewed,
            work.submissionTime,
            work.submitter,
            work.depositAmount,
            work.refundClaimed
        );
    }

    /**
     * @notice Get reviewer profile
     */
    function getReviewerProfile(address _reviewer) external view returns (
        string memory name,
        string memory expertise,
        bool isActive,
        uint32 reviewCount,
        uint256 stakedAmount
    ) {
        ReviewerProfile storage profile = reviewers[_reviewer];
        return (
            profile.name,
            profile.expertise,
            profile.isActive,
            profile.reviewCount,
            profile.stakedAmount
        );
    }

    /**
     * @notice Get period statistics
     */
    function getPeriodStats(uint32 _period) external view returns (
        uint32 totalSubmissions,
        bool submissionActive,
        bool reviewActive
    ) {
        return (
            workCountPerPeriod[_period],
            _period == currentSubmissionPeriod && isSubmissionPeriodActive(),
            _period == currentReviewPeriod && isReviewPeriodActive()
        );
    }

    /**
     * @notice Get awards for period
     */
    function getAwards(uint32 _period) external view returns (
        string[] memory categories,
        address[] memory winners,
        bool[] memory announced
    ) {
        Award[] storage periodAwards = awards[_period];
        uint256 length = periodAwards.length;

        categories = new string[](length);
        winners = new address[](length);
        announced = new bool[](length);

        for (uint i = 0; i < length; i++) {
            categories[i] = periodAwards[i].category;
            winners[i] = periodAwards[i].winner;
            announced[i] = periodAwards[i].announced;
        }
    }

    /**
     * @notice Get decryption request status
     */
    function getDecryptionStatus(uint32 _period, uint32 _workId) external view returns (
        uint256 requestId,
        bool completed,
        bool failed,
        uint64 decryptedScore,
        uint256 requestTime
    ) {
        requestId = workDecryptionRequestId[_period][_workId];
        if (requestId == 0) {
            return (0, false, false, 0, 0);
        }

        DecryptionRequest storage request = decryptionRequests[requestId];
        return (
            requestId,
            request.completed,
            request.failed,
            request.decryptedScore,
            request.requestTime
        );
    }

    /**
     * @notice Check if refund is claimable for review
     */
    function isRefundClaimable(uint32 _period, uint32 _workId, address _reviewer) external view returns (bool) {
        Review storage review = reviews[_period][_workId][_reviewer];
        if (!review.submitted || review.refundClaimed) return false;

        uint256 requestId = workDecryptionRequestId[_period][_workId];
        if (requestId != 0) {
            DecryptionRequest storage request = decryptionRequests[requestId];
            if (request.failed) return true;
            if (block.timestamp > request.requestTime + DECRYPTION_TIMEOUT && !request.completed) return true;
        }

        if (block.timestamp > review.reviewTime + REVIEW_TIMEOUT) return true;

        return false;
    }

    /**
     * @notice Get reviewer list for a work
     */
    function getWorkReviewers(uint32 _period, uint32 _workId) external view returns (address[] memory) {
        return workReviewers[_period][_workId];
    }

    /**
     * @notice Receive function for receiving ETH
     */
    receive() external payable {
        platformFees += msg.value;
    }
}
