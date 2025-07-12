const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=================================================");
  console.log("Literature Review System - Deployment Script");
  console.log("=================================================\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("=================================================\n");

  // Deploy the contract
  console.log("Deploying LiteratureReviewSystem contract...");
  const LiteratureReviewSystem = await hre.ethers.getContractFactory("LiteratureReviewSystem");

  const startTime = Date.now();
  const literatureReviewSystem = await LiteratureReviewSystem.deploy();

  await literatureReviewSystem.waitForDeployment();
  const endTime = Date.now();

  const contractAddress = await literatureReviewSystem.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("=================================================");
  console.log("Contract Address:", contractAddress);
  console.log("Deployment time:", ((endTime - startTime) / 1000).toFixed(2), "seconds");
  console.log("=================================================\n");

  // Get deployment transaction details
  const deploymentTx = literatureReviewSystem.deploymentTransaction();
  if (deploymentTx) {
    console.log("Transaction Details:");
    console.log("- Transaction Hash:", deploymentTx.hash);
    console.log("- Block Number:", deploymentTx.blockNumber);
    console.log("- Gas Price:", hre.ethers.formatUnits(deploymentTx.gasPrice || 0n, "gwei"), "gwei");
    console.log("=================================================\n");
  }

  // Verify contract state
  console.log("Verifying initial contract state...");
  const owner = await literatureReviewSystem.owner();
  const currentSubmissionPeriod = await literatureReviewSystem.currentSubmissionPeriod();
  const currentReviewPeriod = await literatureReviewSystem.currentReviewPeriod();

  console.log("- Owner:", owner);
  console.log("- Current Submission Period:", currentSubmissionPeriod.toString());
  console.log("- Current Review Period:", currentReviewPeriod.toString());
  console.log("=================================================\n");

  // Save deployment information
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: deploymentTx?.hash || "",
    blockNumber: deploymentTx?.blockNumber || 0,
    owner: owner,
    currentSubmissionPeriod: currentSubmissionPeriod.toString(),
    currentReviewPeriod: currentReviewPeriod.toString()
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info to JSON file
  const deploymentFile = path.join(deploymentsDir, `deployment-${network.name}-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to:", deploymentFile);

  // Save latest deployment info
  const latestFile = path.join(deploymentsDir, `latest-${network.name}.json`);
  fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("Latest deployment info saved to:", latestFile);
  console.log("=================================================\n");

  // Display Etherscan link for Sepolia
  if (network.chainId === 11155111n) {
    console.log("📊 View on Etherscan:");
    console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("\n🔍 Verify contract with:");
    console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
    console.log("=================================================\n");
  }

  console.log("✨ Deployment completed successfully!");
  console.log("=================================================\n");

  return contractAddress;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed!");
    console.error(error);
    process.exit(1);
  });
