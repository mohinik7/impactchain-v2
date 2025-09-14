const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting ImpactChain deployment...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Step 1: Deploy ImpactToken contract first
  console.log("\n📄 Deploying ImpactToken contract...");
  const impactToken = await hre.ethers.deployContract("ImpactToken");
  await impactToken.waitForDeployment();
  console.log("✅ ImpactToken deployed to:", impactToken.target);

  // Step 2: Deploy ProjectEscrow contract with ImpactToken address
  console.log("\n🏦 Deploying ProjectEscrow contract...");
  const projectEscrow = await hre.ethers.deployContract("ProjectEscrow", [impactToken.target]);
  await projectEscrow.waitForDeployment();
  console.log("✅ ProjectEscrow deployed to:", projectEscrow.target);

  // Step 3: Verify the connection
  console.log("\n🔗 Verifying contract connection...");
  const connectedImpactToken = await projectEscrow.impactToken();
  console.log("ImpactToken address in ProjectEscrow:", connectedImpactToken);
  
  if (connectedImpactToken.toLowerCase() === impactToken.target.toLowerCase()) {
    console.log("✅ Contract connection verified!");
  } else {
    console.log("❌ Contract connection failed!");
  }

  // Step 4: Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    contracts: {
      ImpactToken: {
        address: impactToken.target,
        constructorArgs: []
      },
      ProjectEscrow: {
        address: projectEscrow.target,
        constructorArgs: [impactToken.target]
      }
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n📋 Deployment Summary:");
  console.log("Network:", deploymentInfo.network);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("ImpactToken:", deploymentInfo.contracts.ImpactToken.address);
  console.log("ProjectEscrow:", deploymentInfo.contracts.ProjectEscrow.address);

  // Step 5: Optional verification (if on a public network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await impactToken.deploymentTransaction().wait(6);
    await projectEscrow.deploymentTransaction().wait(6);

    console.log("\n🔍 Verifying contracts on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: impactToken.target,
        constructorArguments: [],
      });
      console.log("✅ ImpactToken verified");
    } catch (error) {
      console.log("❌ ImpactToken verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: projectEscrow.target,
        constructorArguments: [impactToken.target],
      });
      console.log("✅ ProjectEscrow verified");
    } catch (error) {
      console.log("❌ ProjectEscrow verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Update your frontend with the new contract addresses");
  console.log("2. Test the contracts with sample transactions");
  console.log("3. Set up monitoring and alerts");
}

// This pattern is recommended to handle errors properly
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});