/**
 * Deployment Script for AuditLog Smart Contract
 * 
 * This script deploys the AuditLog smart contract to the blockchain
 * and saves the contract address and ABI for frontend integration
 */

const fs = require("fs");
const path = require("path");

const DEPLOYMENT_CONFIG_PATH = path.join(__dirname, "../artifacts/deployment.json");

async function main() {
  console.log("🚀 Starting AuditLog smart contract deployment...\n");

  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`📝 Deploying contract with account: ${deployer.address}`);
    console.log(`💰 Account balance: ${(await deployer.getBalance()).toString()} wei\n`);

    // Get contract factory
    const AuditLog = await ethers.getContractFactory("AuditLog");
    console.log("📦 Compiling AuditLog contract...\n");

    // Deploy contract
    const auditLog = await AuditLog.deploy();
    console.log("⏳ Waiting for deployment transaction to be mined...");
    await auditLog.deployed();

    console.log(`✅ AuditLog contract deployed successfully!`);
    console.log(`📍 Contract address: ${auditLog.address}\n`);

    // Get contract details
    const deploymentBlock = await ethers.provider.getBlockNumber();
    const deploymentTx = auditLog.deployTransaction;

    console.log("📊 Deployment Details:");
    console.log(`  - Transaction Hash: ${deploymentTx.hash}`);
    console.log(`  - Contract Address: ${auditLog.address}`);
    console.log(`  - Deployed Block: ${deploymentBlock}`);
    console.log(`  - Deployer: ${deployer.address}\n`);

    // Verify deployment
    console.log("🔍 Verifying contract...");
    const code = await ethers.provider.getCode(auditLog.address);
    if (code === "0x") {
      throw new Error("Contract deployment verification failed!");
    }
    console.log("✅ Contract code verified on blockchain\n");

    // Get ABI
    const artifact = require("../artifacts/contracts/AuditLog.sol/AuditLog.json");
    const abi = artifact.abi;

    // Save deployment config
    const deploymentConfig = {
      contractAddress: auditLog.address,
      deployer: deployer.address,
      deploymentBlock: deploymentBlock,
      transactionHash: deploymentTx.hash,
      network: hre.network.name,
      abi: abi,
      timestamp: new Date().toISOString(),
    };

    // Ensure artifacts directory exists
    if (!fs.existsSync(path.dirname(DEPLOYMENT_CONFIG_PATH))) {
      fs.mkdirSync(path.dirname(DEPLOYMENT_CONFIG_PATH), { recursive: true });
    }

    fs.writeFileSync(
      DEPLOYMENT_CONFIG_PATH,
      JSON.stringify(deploymentConfig, null, 2)
    );
    console.log(`📋 Deployment config saved to: ${DEPLOYMENT_CONFIG_PATH}\n`);

    // Also save env template
    const envContent = `# Smart Contract Deployment Configuration
REACT_APP_CONTRACT_ADDRESS=${auditLog.address}
REACT_APP_CONTRACT_NETWORK=${hre.network.name}

# For backend integration
SMART_CONTRACT_ADDRESS=${auditLog.address}
SMART_CONTRACT_NETWORK=${hre.network.name}

# Infura API Key (for testnet deployment)
INFURA_API_KEY=your_infura_api_key_here

# Private Key (for deployment - NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key_here`;

    const envPath = path.join(__dirname, "../.env");
    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, envContent);
      console.log(`📄 Created .env template at: ${envPath}\n`);
    }

    console.log("✨ ============================================ ✨");
    console.log("   Deployment completed successfully!");
    console.log("✨ ============================================ ✨\n");

    console.log("📌 Next Steps:");
    console.log(`   1. Copy the contract address: ${auditLog.address}`);
    console.log("   2. Add to your .env.local file (frontend)");
    console.log("   3. Update backend environment variables");
    console.log("   4. Update the frontend API client with the new address\n");

    console.log("🔗 Contract Interaction:");
    console.log("   - Read logs from blockchain");
    console.log("   - Add new logs (requires signer)");
    console.log("   - Verify blockchain integrity\n");

    return auditLog.address;
  } catch (error) {
    console.error("❌ Deployment failed!");
    console.error(error);
    process.exit(1);
  }
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
