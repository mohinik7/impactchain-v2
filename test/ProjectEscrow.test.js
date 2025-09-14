const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ImpactChain System", function () {
  let impactToken, projectEscrow;
  let owner, ngo, donor;

  beforeEach(async function () {
    [owner, ngo, donor] = await ethers.getSigners();
    
    // Deploy ImpactToken first
    const ImpactTokenFactory = await ethers.getContractFactory("ImpactToken");
    impactToken = await ImpactTokenFactory.deploy();
    await impactToken.waitForDeployment();
    
    // Deploy ProjectEscrow with ImpactToken address
    const ProjectEscrowFactory = await ethers.getContractFactory("ProjectEscrow");
    projectEscrow = await ProjectEscrowFactory.deploy(impactToken.target);
    await projectEscrow.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy both contracts successfully", async function () {
      expect(impactToken.target).to.not.equal(0);
      expect(projectEscrow.target).to.not.equal(0);
    });

    it("Should connect contracts properly", async function () {
      const connectedImpactToken = await projectEscrow.impactToken();
      expect(connectedImpactToken).to.equal(impactToken.target);
    });
  });

  describe("Project Creation", function () {
    it("Should allow an NGO to create a new project", async function () {
      // 1. Arrange: Set up the test data
      const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("2")];
      const milestoneDescriptions = ["First milestone", "Second milestone"];
      const projectName = "Test Project";
      const description = "A test project for impact measurement";
      const expectedTotalAmount = ethers.parseEther("3");

      // 2. Act: Call the function we want to test
      await projectEscrow.createProject(
        ngo.address,
        milestoneAmounts,
        milestoneDescriptions,
        projectName,
        description
      );

      // 3. Assert: Check if the outcome is correct
      const project = await projectEscrow.getProject(1);

      expect(await projectEscrow.projectCounter()).to.equal(1);
      expect(project.projectId).to.equal(1);
      expect(project.creator).to.equal(ngo.address);
      expect(project.totalAmount).to.equal(expectedTotalAmount);
      expect(project.fundsRaised).to.equal(0);
      expect(project.isComplete).to.be.false;
      expect(project.projectName).to.equal(projectName);
      expect(project.description).to.equal(description);
    });

    it("Should reject project creation with mismatched arrays", async function () {
      const milestoneAmounts = [ethers.parseEther("1")];
      const milestoneDescriptions = ["First milestone", "Second milestone"];

      await expect(
        projectEscrow.createProject(
          ngo.address,
          milestoneAmounts,
          milestoneDescriptions,
          "Test Project",
          "Description"
        )
      ).to.be.revertedWith("Input arrays must have the same length");
    });
  });

  describe("Donations", function () {
    beforeEach(async function () {
      // Create a project first
      const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("2")];
      const milestoneDescriptions = ["First milestone", "Second milestone"];
      
      await projectEscrow.createProject(
        ngo.address,
        milestoneAmounts,
        milestoneDescriptions,
        "Test Project",
        "Description"
      );
    });

    it("Should allow donations to projects", async function () {
      const donationAmount = ethers.parseEther("1.5");
      
      await expect(
        projectEscrow.connect(donor).donate(1, { value: donationAmount })
      ).to.emit(projectEscrow, "ProjectFunded")
        .withArgs(1, donor.address, donationAmount);

      const project = await projectEscrow.getProject(1);
      expect(project.fundsRaised).to.equal(donationAmount);
      expect(project.donor).to.equal(donor.address);
    });

    it("Should reject donations exceeding project total", async function () {
      const excessiveAmount = ethers.parseEther("5");
      
      await expect(
        projectEscrow.connect(donor).donate(1, { value: excessiveAmount })
      ).to.be.revertedWith("Donation exceeds the required amount");
    });
  });

  describe("Milestone Management", function () {
    beforeEach(async function () {
      // Create and fund a project
      const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("2")];
      const milestoneDescriptions = ["First milestone", "Second milestone"];
      
      await projectEscrow.createProject(
        ngo.address,
        milestoneAmounts,
        milestoneDescriptions,
        "Test Project",
        "Description"
      );
      
      await projectEscrow.connect(donor).donate(1, { value: ethers.parseEther("3") });
    });

    it("Should allow owner to verify milestones", async function () {
      await expect(
        projectEscrow.verifyMilestone(1, 0)
      ).to.emit(projectEscrow, "MilestoneVerified")
        .withArgs(1, 0);

      const milestone = await projectEscrow.getMilestone(1, 0);
      expect(milestone.state).to.equal(1); // MilestoneState.Verified
    });

    it("Should allow owner to pay verified milestones", async function () {
      // First verify the milestone
      await projectEscrow.verifyMilestone(1, 0);
      
      // Then pay it
      await expect(
        projectEscrow.payMilestone(1, 0)
      ).to.emit(projectEscrow, "MilestonePaid")
        .withArgs(1, 0, ethers.parseEther("1"));

      const milestone = await projectEscrow.getMilestone(1, 0);
      expect(milestone.state).to.equal(2); // MilestoneState.Paid
    });
  });

  describe("Project Completion", function () {
    beforeEach(async function () {
      // Create, fund, verify, and pay all milestones
      const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("2")];
      const milestoneDescriptions = ["First milestone", "Second milestone"];
      
      await projectEscrow.createProject(
        ngo.address,
        milestoneAmounts,
        milestoneDescriptions,
        "Test Project",
        "Description"
      );
      
      await projectEscrow.connect(donor).donate(1, { value: ethers.parseEther("3") });
      
      // Verify and pay both milestones
      await projectEscrow.verifyMilestone(1, 0);
      await projectEscrow.payMilestone(1, 0);
      await projectEscrow.verifyMilestone(1, 1);
      await projectEscrow.payMilestone(1, 1);
    });

    it("Should complete project and mint ImpactToken", async function () {
      const impactValue = 1000;
      const imageUri = "https://example.com/impact-image.jpg";
      
      await expect(
        projectEscrow.completeProject(1, impactValue, imageUri)
      ).to.emit(projectEscrow, "ProjectCompleted")
        .withArgs(1)
        .and.to.emit(projectEscrow, "ImpactTokenAwarded");

      const project = await projectEscrow.getProject(1);
      expect(project.isComplete).to.be.true;
      
      // Check if ImpactToken was minted
      const totalSupply = await impactToken.totalSupply();
      expect(totalSupply).to.equal(1);
    });
  });
});