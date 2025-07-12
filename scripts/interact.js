const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=================================================");
  console.log("Literature Review System - Interaction Script");
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
      console.log("  npx hardhat run scripts/interact.js --network sepolia [CONTRACT_ADDRESS]");
      console.log("=================================================\n");
      process.exit(1);
    }
  }

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("Interacting with account:", signer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("=================================================\n");

  // Connect to contract
  console.log("Connecting to contract...");
  const LiteratureReviewSystem = await hre.ethers.getContractFactory("LiteratureReviewSystem");
  const contract = LiteratureReviewSystem.attach(contractAddress);
  console.log("✅ Connected to LiteratureReviewSystem at:", contractAddress);
  console.log("=================================================\n");

  // Display contract information
  console.log("📊 Contract Information:");
  console.log("=================================================");

  try {
    const owner = await contract.owner();
    const currentSubmissionPeriod = await contract.currentSubmissionPeriod();
    const currentReviewPeriod = await contract.currentReviewPeriod();
    const isSubmissionActive = await contract.isSubmissionPeriodActive();
    const isReviewActive = await contract.isReviewPeriodActive();

    console.log("Owner:", owner);
    console.log("Current Submission Period:", currentSubmissionPeriod.toString());
    console.log("Current Review Period:", currentReviewPeriod.toString());
    console.log("Submission Period Active:", isSubmissionActive);
    console.log("Review Period Active:", isReviewActive);
    console.log("=================================================\n");

    // Get period statistics
    console.log("📈 Period Statistics:");
    console.log("=================================================");
    const stats = await contract.getPeriodStats(currentSubmissionPeriod);
    console.log("Total Submissions:", stats.totalSubmissions.toString());
    console.log("Submission Active:", stats.submissionActive);
    console.log("Review Active:", stats.reviewActive);
    console.log("=================================================\n");

    // Check if current user is the owner
    const isOwner = signer.address.toLowerCase() === owner.toLowerCase();
    console.log("Your Role:");
    console.log("=================================================");
    console.log("Is Owner:", isOwner);

    const isAuthorizedReviewer = await contract.authorizedReviewers(signer.address);
    console.log("Is Authorized Reviewer:", isAuthorizedReviewer);
    console.log("=================================================\n");

    // Interactive menu
    await displayMenu(contract, signer, isOwner, isAuthorizedReviewer, isSubmissionActive, isReviewActive);

  } catch (error) {
    console.error("❌ Error reading contract state:", error.message);
    process.exit(1);
  }
}

async function displayMenu(contract, signer, isOwner, isAuthorizedReviewer, isSubmissionActive, isReviewActive) {
  console.log("📋 Available Actions:");
  console.log("=================================================");
  console.log("1. View submission details");
  console.log("2. View reviewer profile");
  console.log("3. View period awards");
  console.log("4. Submit literary work (requires active submission period)");
  console.log("5. Register as reviewer");
  console.log("6. Submit review (requires authorized reviewer + active review period)");

  if (isOwner) {
    console.log("\n🔐 Owner Actions:");
    console.log("7. Start submission period");
    console.log("8. Start review period");
    console.log("9. Approve reviewer");
    console.log("10. Calculate results");
    console.log("11. Announce awards");
  }

  console.log("\n0. Exit");
  console.log("=================================================\n");

  console.log("ℹ️  To perform actions, modify this script or use the simulate.js script");
  console.log("=================================================\n");

  // Example: View first submission if exists
  try {
    const currentPeriod = await contract.currentSubmissionPeriod();
    const submissionInfo = await contract.getSubmissionInfo(currentPeriod, 1);

    if (submissionInfo.submitted) {
      console.log("📚 Example - First Submission in Current Period:");
      console.log("=================================================");
      console.log("Title:", submissionInfo.title);
      console.log("Author:", submissionInfo.author);
      console.log("Genre:", submissionInfo.genre);
      console.log("Submitted:", submissionInfo.submitted);
      console.log("Reviewed:", submissionInfo.reviewed);
      console.log("Submission Time:", new Date(Number(submissionInfo.submissionTime) * 1000).toISOString());
      console.log("Submitter:", submissionInfo.submitter);
      console.log("=================================================\n");
    } else {
      console.log("ℹ️  No submissions found in current period");
      console.log("=================================================\n");
    }
  } catch (error) {
    console.log("ℹ️  No submissions available to display");
    console.log("=================================================\n");
  }

  // Example: View reviewer profile if exists
  try {
    const reviewerProfile = await contract.getReviewerProfile(signer.address);

    if (reviewerProfile.name) {
      console.log("👤 Your Reviewer Profile:");
      console.log("=================================================");
      console.log("Name:", reviewerProfile.name);
      console.log("Expertise:", reviewerProfile.expertise);
      console.log("Is Active:", reviewerProfile.isActive);
      console.log("Review Count:", reviewerProfile.reviewCount.toString());
      console.log("=================================================\n");
    }
  } catch (error) {
    // No profile exists
  }
}

// Example function to submit a work (for demonstration)
async function submitWork(contract, title, author, genre, ipfsHash) {
  console.log("Submitting literary work...");
  console.log("=================================================");

  try {
    const tx = await contract.submitWork(title, author, genre, ipfsHash);
    console.log("Transaction sent:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ Work submitted successfully!");
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("=================================================\n");
  } catch (error) {
    console.error("❌ Error submitting work:", error.message);
  }
}

// Example function to register as reviewer
async function registerReviewer(contract, name, expertise) {
  console.log("Registering as reviewer...");
  console.log("=================================================");

  try {
    const tx = await contract.registerReviewer(name, expertise);
    console.log("Transaction sent:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ Registered successfully!");
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("⚠️  Awaiting owner approval to become active reviewer");
    console.log("=================================================\n");
  } catch (error) {
    console.error("❌ Error registering:", error.message);
  }
}

// Example function to submit review
async function submitReview(contract, workId, qualityScore, originalityScore, impactScore, comments) {
  console.log("Submitting review...");
  console.log("=================================================");

  try {
    const tx = await contract.submitReview(workId, qualityScore, originalityScore, impactScore, comments);
    console.log("Transaction sent:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ Review submitted successfully!");
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("=================================================\n");
  } catch (error) {
    console.error("❌ Error submitting review:", error.message);
  }
}

// Execute interaction
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Interaction failed!");
    console.error(error);
    process.exit(1);
  });
