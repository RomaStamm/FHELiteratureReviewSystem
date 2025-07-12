const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=================================================");
  console.log("Literature Review System - Simulation Script");
  console.log("=================================================\n");

  // Get contract address from command line or latest deployment
  let contractAddress = process.argv[2];

  if (!contractAddress) {
    console.log("No contract address provided, checking latest deployment...\n");

    const network = await hre.ethers.provider.getNetwork();
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    const latestFile = path.join(deploymentsDir, `latest-${network.name}.json`);

    if (fs.existsSync(latestFile)) {
      const deploymentInfo = JSON.parse(fs.readFileSync(latestFile, "utf8"));
      contractAddress = deploymentInfo.contractAddress;
      console.log("Found latest deployment:");
      console.log("- Contract Address:", contractAddress);
      console.log("=================================================\n");
    } else {
      console.error("❌ No deployment file found and no address provided");
      console.log("\nUsage:");
      console.log("  npx hardhat run scripts/simulate.js --network sepolia [CONTRACT_ADDRESS]");
      console.log("=================================================\n");
      process.exit(1);
    }
  }

  // Get signers
  const [owner, author1, author2, reviewer1, reviewer2] = await hre.ethers.getSigners();

  console.log("Simulation Accounts:");
  console.log("=================================================");
  console.log("Owner:", owner.address);
  console.log("Author 1:", author1.address);
  console.log("Author 2:", author2.address);
  console.log("Reviewer 1:", reviewer1.address);
  console.log("Reviewer 2:", reviewer2.address);
  console.log("=================================================\n");

  // Connect to contract
  console.log("Connecting to contract...");
  const LiteratureReviewSystem = await hre.ethers.getContractFactory("LiteratureReviewSystem");
  const contract = LiteratureReviewSystem.attach(contractAddress);
  console.log("✅ Connected to LiteratureReviewSystem");
  console.log("=================================================\n");

  try {
    // Step 1: Check initial state
    console.log("Step 1: Checking Initial State");
    console.log("=================================================");
    const initialOwner = await contract.owner();
    const initialSubmissionPeriod = await contract.currentSubmissionPeriod();
    const initialReviewPeriod = await contract.currentReviewPeriod();

    console.log("Owner:", initialOwner);
    console.log("Current Submission Period:", initialSubmissionPeriod.toString());
    console.log("Current Review Period:", initialReviewPeriod.toString());
    console.log("✅ Initial state verified");
    console.log("=================================================\n");

    await sleep(2000);

    // Step 2: Register reviewers
    console.log("Step 2: Registering Reviewers");
    console.log("=================================================");

    console.log("Registering Reviewer 1...");
    let tx = await contract.connect(reviewer1).registerReviewer(
      "Dr. Emily Thompson",
      "Contemporary Fiction & Literary Criticism"
    );
    await tx.wait();
    console.log("✅ Reviewer 1 registered:", reviewer1.address);

    console.log("Registering Reviewer 2...");
    tx = await contract.connect(reviewer2).registerReviewer(
      "Prof. Michael Chen",
      "Poetry & Modernist Literature"
    );
    await tx.wait();
    console.log("✅ Reviewer 2 registered:", reviewer2.address);
    console.log("=================================================\n");

    await sleep(2000);

    // Step 3: Owner approves reviewers
    console.log("Step 3: Approving Reviewers (Owner Action)");
    console.log("=================================================");

    console.log("Approving Reviewer 1...");
    tx = await contract.connect(owner).approveReviewer(reviewer1.address);
    await tx.wait();
    console.log("✅ Reviewer 1 approved");

    console.log("Approving Reviewer 2...");
    tx = await contract.connect(owner).approveReviewer(reviewer2.address);
    await tx.wait();
    console.log("✅ Reviewer 2 approved");
    console.log("=================================================\n");

    await sleep(2000);

    // Step 4: Check if submission period is active
    console.log("Step 4: Checking Submission Period");
    console.log("=================================================");
    const isSubmissionActive = await contract.isSubmissionPeriodActive();
    console.log("Submission Period Active:", isSubmissionActive);

    if (!isSubmissionActive) {
      console.log("⚠️  Submission period is not active");
      console.log("Note: Submission period is first 14 days of each 30-day cycle");
      console.log("You may need to wait or adjust the contract logic for testing");
    }
    console.log("=================================================\n");

    await sleep(2000);

    // Step 5: Submit literary works (if submission period is active)
    if (isSubmissionActive) {
      console.log("Step 5: Submitting Literary Works");
      console.log("=================================================");

      console.log("Author 1 submitting work...");
      tx = await contract.connect(author1).submitWork(
        "The Silent Echo",
        "Sarah Williams",
        "Fiction",
        "QmX7ZhMr5J8KnP9vL4TqW2NxYzBpHcVrUsD8jQ3fM6tGe1"
      );
      await tx.wait();
      console.log("✅ Work 1 submitted: 'The Silent Echo'");

      console.log("Author 2 submitting work...");
      tx = await contract.connect(author2).submitWork(
        "Whispers in the Wind",
        "James Anderson",
        "Poetry",
        "QmY8ZiNs6K9LoQ0wM5UrX3OyZcCqIdWsTvE9kR4gN7uHf2"
      );
      await tx.wait();
      console.log("✅ Work 2 submitted: 'Whispers in the Wind'");
      console.log("=================================================\n");

      await sleep(2000);

      // Step 6: Display submitted works
      console.log("Step 6: Viewing Submitted Works");
      console.log("=================================================");

      const currentPeriod = await contract.currentSubmissionPeriod();
      const stats = await contract.getPeriodStats(currentPeriod);
      console.log("Total Submissions:", stats.totalSubmissions.toString());

      for (let i = 1; i <= Number(stats.totalSubmissions); i++) {
        const submission = await contract.getSubmissionInfo(currentPeriod, i);
        console.log(`\nWork ${i}:`);
        console.log("  Title:", submission.title);
        console.log("  Author:", submission.author);
        console.log("  Genre:", submission.genre);
        console.log("  Submitter:", submission.submitter);
        console.log("  Submitted:", submission.submitted);
      }
      console.log("=================================================\n");

      await sleep(2000);
    } else {
      console.log("Step 5-6: Skipped (Submission period not active)");
      console.log("=================================================\n");
    }

    // Step 7: Check review period
    console.log("Step 7: Checking Review Period");
    console.log("=================================================");
    const isReviewActive = await contract.isReviewPeriodActive();
    console.log("Review Period Active:", isReviewActive);

    if (!isReviewActive) {
      console.log("⚠️  Review period is not active");
      console.log("Note: Review period is last 16 days of each 30-day cycle");
    }
    console.log("=================================================\n");

    await sleep(2000);

    // Step 8: Submit reviews (if review period is active)
    if (isReviewActive && isSubmissionActive) {
      console.log("Step 8: Submitting Reviews");
      console.log("=================================================");

      const reviewPeriod = await contract.currentReviewPeriod();

      console.log("Reviewer 1 reviewing Work 1...");
      tx = await contract.connect(reviewer1).submitReview(
        1, // workId
        85, // quality score
        90, // originality score
        80, // impact score
        "Encrypted comment: Excellent narrative structure and character development"
      );
      await tx.wait();
      console.log("✅ Review submitted by Reviewer 1 for Work 1");

      console.log("Reviewer 2 reviewing Work 1...");
      tx = await contract.connect(reviewer2).submitReview(
        1, // workId
        88, // quality score
        85, // originality score
        87, // impact score
        "Encrypted comment: Strong prose with compelling themes"
      );
      await tx.wait();
      console.log("✅ Review submitted by Reviewer 2 for Work 1");

      console.log("Reviewer 1 reviewing Work 2...");
      tx = await contract.connect(reviewer1).submitReview(
        2, // workId
        92, // quality score
        95, // originality score
        88, // impact score
        "Encrypted comment: Beautiful imagery and emotional depth"
      );
      await tx.wait();
      console.log("✅ Review submitted by Reviewer 1 for Work 2");

      console.log("Reviewer 2 reviewing Work 2...");
      tx = await contract.connect(reviewer2).submitReview(
        2, // workId
        90, // quality score
        93, // originality score
        85, // impact score
        "Encrypted comment: Masterful use of metaphor and rhythm"
      );
      await tx.wait();
      console.log("✅ Review submitted by Reviewer 2 for Work 2");
      console.log("=================================================\n");

      await sleep(2000);
    } else {
      console.log("Step 8: Skipped (Review period not active or no submissions)");
      console.log("=================================================\n");
    }

    // Step 9: Verify reviewer profiles
    console.log("Step 9: Verifying Reviewer Profiles");
    console.log("=================================================");

    const profile1 = await contract.getReviewerProfile(reviewer1.address);
    console.log("Reviewer 1 Profile:");
    console.log("  Name:", profile1.name);
    console.log("  Expertise:", profile1.expertise);
    console.log("  Is Active:", profile1.isActive);
    console.log("  Review Count:", profile1.reviewCount.toString());

    const profile2 = await contract.getReviewerProfile(reviewer2.address);
    console.log("\nReviewer 2 Profile:");
    console.log("  Name:", profile2.name);
    console.log("  Expertise:", profile2.expertise);
    console.log("  Is Active:", profile2.isActive);
    console.log("  Review Count:", profile2.reviewCount.toString());
    console.log("=================================================\n");

    await sleep(2000);

    // Step 10: Summary
    console.log("Step 10: Simulation Summary");
    console.log("=================================================");
    console.log("✅ Simulation completed successfully!");
    console.log("\nActions performed:");
    console.log("  ✓ Registered 2 reviewers");
    console.log("  ✓ Approved 2 reviewers");

    if (isSubmissionActive) {
      console.log("  ✓ Submitted 2 literary works");
    }

    if (isReviewActive && isSubmissionActive) {
      console.log("  ✓ Submitted 4 reviews");
    }

    console.log("\nContract Address:", contractAddress);
    console.log("Network:", (await hre.ethers.provider.getNetwork()).name);

    if ((await hre.ethers.provider.getNetwork()).chainId === 11155111n) {
      console.log("\n📊 View on Etherscan:");
      console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
    }

    console.log("=================================================\n");

  } catch (error) {
    console.error("\n❌ Simulation failed!");
    console.error("Error:", error.message);
    console.log("\nCommon issues:");
    console.log("1. Insufficient gas or funds");
    console.log("2. Period restrictions (submission/review periods)");
    console.log("3. Already registered/reviewed");
    console.log("4. Network connectivity issues");
    console.log("=================================================\n");
    throw error;
  }
}

// Helper function to add delay between steps
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Execute simulation
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Simulation script failed!");
    console.error(error);
    process.exit(1);
  });
