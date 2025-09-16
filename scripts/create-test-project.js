// scripts/create-test-project.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Creating project with account:", deployer.address);

  const ProjectEscrow = await hre.ethers.getContractFactory("ProjectEscrow");
  const projectEscrow = await ProjectEscrow.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"); // Use address from .env.local

  // Create a test project
  const projectName = "Clean Water Initiative";
  const description = "Providing clean water access to rural communities";
  const totalAmount = hre.ethers.parseEther("1.0"); // 1 ETH

  // Define milestones
  const milestoneDescriptions = [
    "Water well construction",
    "Filtration system installation"
  ];
  
  const milestoneAmounts = [
    hre.ethers.parseEther("0.5"),
    hre.ethers.parseEther("0.5")
  ];

  console.log("Creating test project with following details:");
  console.log("Project Name:", projectName);
  console.log("Description:", description);
  console.log("Total Amount:", hre.ethers.formatEther(totalAmount), "ETH");
  console.log("Number of Milestones:", milestoneDescriptions.length);

  try {
    const tx = await projectEscrow.createProject(
      deployer.address,  // _ngo parameter
      milestoneAmounts,  // _milestoneAmounts array
      milestoneDescriptions,  // _milestoneDescriptions array
      projectName,  // _projectName
      description   // _description
    );

    console.log("Transaction sent! Hash:", tx.hash);
    console.log("Waiting for confirmation...");
    
    await tx.wait();
    
    // Get the newly created project's ID
    const projectCount = await projectEscrow.projectCounter();
    console.log("Project created successfully with ID:", Number(projectCount) - 1);
  } catch (error) {
    console.error("Transaction Error:", error.message);
    // Log more details if available
    if (error.data) {
      console.error("Error data:", error.data);
    }
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });