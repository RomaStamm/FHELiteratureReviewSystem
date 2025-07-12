const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=================================================");
  console.log("Literature Review System - Verification Script");
  console.log("=================================================\n");

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("=================================================\n");

  // Check if we're on Sepolia
  if (network.chainId !== 11155111n) {
    console.log("⚠️  This script is designed for Sepolia testnet");
    console.log("Current network is not Sepolia. Verification may not work.");
    console.log("=================================================\n");
  }

  // Check if ETHERSCAN_API_KEY is set
  if (!process.env.ETHERSCAN_API_KEY) {
    console.error("❌ Error: ETHERSCAN_API_KEY not found in environment variables");
    console.log("\nPlease set your Etherscan API key in the .env file:");
    console.log("ETHERSCAN_API_KEY=your_api_key_here\n");
    console.log("Get your API key at: https://etherscan.io/myapikey");
    console.log("=================================================\n");
    process.exit(1);
  }

  // Get contract address from command line or latest deployment
  let contractAddress = process.argv[2];

  if (!contractAddress) {
    console.log("No contract address provided, checking latest deployment...\n");

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    const latestFile = path.join(deploymentsDir, `latest-${network.name}.json`);

    if (fs.existsSync(latestFile)) {
      const deploymentInfo = JSON.parse(fs.readFileSync(latestFile, "utf8"));
      contractAddress = deploymentInfo.contractAddress;
      console.log("Found latest deployment:");
      console.log("- Contract Address:", contractAddress);
      console.log("- Deployed at:", deploymentInfo.deploymentTime);
      console.log("=================================================\n");
    } else {
      console.error("❌ No deployment file found and no address provided");
      console.log("\nUsage:");
      console.log("  npx hardhat run scripts/verify.js --network sepolia [CONTRACT_ADDRESS]");
      console.log("\nOr deploy a contract first with:");
      console.log("  npx hardhat run scripts/deploy.js --network sepolia");
      console.log("=================================================\n");
      process.exit(1);
    }
  }

  console.log("Verifying contract at address:", contractAddress);
  console.log("=================================================\n");

  try {
    console.log("Starting verification process...");
    console.log("This may take a few minutes...\n");

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log("\n✅ Contract verified successfully!");
    console.log("=================================================");
    console.log("View verified contract at:");
    console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code`);
    console.log("=================================================\n");

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Contract is already verified!");
      console.log("=================================================");
      console.log("View verified contract at:");
      console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code`);
      console.log("=================================================\n");
    } else {
      console.error("\n❌ Verification failed!");
      console.error(error.message);
      console.log("\n=================================================");
      console.log("Common issues:");
      console.log("1. Contract was just deployed - wait a minute and try again");
      console.log("2. Invalid Etherscan API key");
      console.log("3. Wrong network selected");
      console.log("4. Constructor arguments mismatch");
      console.log("=================================================\n");
      process.exit(1);
    }
  }

  // Verify contract is accessible on Etherscan
  console.log("Checking contract accessibility...");
  try {
    const contract = await hre.ethers.getContractAt("LiteratureReviewSystem", contractAddress);
    const owner = await contract.owner();
    console.log("- Contract owner:", owner);
    console.log("- Contract is accessible and functional ✅");
    console.log("=================================================\n");
  } catch (error) {
    console.error("⚠️  Warning: Could not verify contract accessibility");
    console.error(error.message);
    console.log("=================================================\n");
  }
}

// Execute verification
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Verification script failed!");
    console.error(error);
    process.exit(1);
  });
