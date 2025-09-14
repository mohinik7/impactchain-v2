// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ImpactToken.sol";

contract ProjectEscrow is Ownable, ReentrancyGuard {
    // Reference to the ImpactToken contract
    ImpactToken public impactToken;
    
    // Constructor to initialize the contract with an owner and ImpactToken address
    constructor(address _impactTokenAddress) Ownable(msg.sender) {
        impactToken = ImpactToken(_impactTokenAddress);
    }

    // An enum to represent the possible states of a milestone
    enum MilestoneState {
        Pending,
        Verified,
        Paid
    }

    // A struct to hold the details of a single milestone
    struct Milestone {
        string description;
        uint256 amount;
        MilestoneState state;
    }

    // A struct to encapsulate all data for a single project
    struct Project {
        uint256 projectId;
        address payable creator; // The NGO who created the project
        address donor;         // The corporation who funded the project
        uint256 totalAmount;
        uint256 fundsRaised;
        Milestone[] milestones; // An array to hold all milestones for the project
        bool isComplete;
        string projectName;
        string description;
        uint256 createdAt;
    }

    // State variables to store and track projects
    mapping(uint256 => Project) public projects;
    uint256 public projectCounter;
    
    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed creator, uint256 totalAmount);
    event ProjectFunded(uint256 indexed projectId, address indexed donor, uint256 amount);
    event MilestoneVerified(uint256 indexed projectId, uint256 indexed milestoneIndex);
    event MilestonePaid(uint256 indexed projectId, uint256 indexed milestoneIndex, uint256 amount);
    event ProjectCompleted(uint256 indexed projectId);
    event ImpactTokenAwarded(uint256 indexed projectId, uint256 indexed tokenId, address indexed recipient);

    function createProject(
        address payable _ngo,
        uint256[] memory _milestoneAmounts,
        string[] memory _milestoneDescriptions,
        string memory _projectName,
        string memory _description
    ) external {
        // --- Validation ---
        require(
            _milestoneAmounts.length == _milestoneDescriptions.length,
            "Input arrays must have the same length"
        );
        require(
            _milestoneAmounts.length > 0,
            "Project must have at least one milestone"
        );

        // --- Project Creation ---
        projectCounter++;
        uint256 newProjectId = projectCounter;

        Project storage newProject = projects[newProjectId];
        newProject.projectId = newProjectId;
        newProject.creator = _ngo;

        // --- Milestone Population ---
        uint256 totalProjectAmount = 0;
        for (uint i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Milestone amount must be greater than 0");
            totalProjectAmount += _milestoneAmounts[i];

            newProject.milestones.push(
                Milestone({
                    description: _milestoneDescriptions[i],
                    amount: _milestoneAmounts[i],
                    state: MilestoneState.Pending
                })
            );
        }

        newProject.totalAmount = totalProjectAmount;
        newProject.projectName = _projectName;
        newProject.description = _description;
        newProject.createdAt = block.timestamp;
        
        emit ProjectCreated(newProjectId, _ngo, totalProjectAmount);
    }

    function donate(uint256 _projectId) external payable nonReentrant {
        // --- Get Project & Validate ---
        Project storage project = projects[_projectId];

        require(project.creator != address(0), "Project does not exist");
        require(
            project.fundsRaised < project.totalAmount,
            "Project is already fully funded"
        );
        require(msg.value > 0, "Donation must be greater than zero");
        require(
            project.fundsRaised + msg.value <= project.totalAmount,
            "Donation exceeds the required amount"
        );

        // --- Update State ---
        project.fundsRaised += msg.value;
        project.donor = msg.sender;
        
        emit ProjectFunded(_projectId, msg.sender, msg.value);
    }
    
    /**
     * @dev Verify a milestone (only owner can verify)
     * @param _projectId The ID of the project
     * @param _milestoneIndex The index of the milestone to verify
     */
    function verifyMilestone(uint256 _projectId, uint256 _milestoneIndex) external onlyOwner {
        Project storage project = projects[_projectId];
        require(project.creator != address(0), "Project does not exist");
        require(_milestoneIndex < project.milestones.length, "Invalid milestone index");
        require(project.milestones[_milestoneIndex].state == MilestoneState.Pending, "Milestone already processed");
        
        project.milestones[_milestoneIndex].state = MilestoneState.Verified;
        
        emit MilestoneVerified(_projectId, _milestoneIndex);
    }
    
    /**
     * @dev Pay out a verified milestone
     * @param _projectId The ID of the project
     * @param _milestoneIndex The index of the milestone to pay
     */
    function payMilestone(uint256 _projectId, uint256 _milestoneIndex) external onlyOwner nonReentrant {
        Project storage project = projects[_projectId];
        require(project.creator != address(0), "Project does not exist");
        require(_milestoneIndex < project.milestones.length, "Invalid milestone index");
        require(project.milestones[_milestoneIndex].state == MilestoneState.Verified, "Milestone not verified");
        
        uint256 amount = project.milestones[_milestoneIndex].amount;
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        project.milestones[_milestoneIndex].state = MilestoneState.Paid;
        
        // Transfer funds to NGO
        (bool success, ) = project.creator.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit MilestonePaid(_projectId, _milestoneIndex, amount);
    }
    
    /**
     * @dev Complete a project and mint ImpactToken
     * @param _projectId The ID of the project to complete
     * @param _impactValue The quantified impact value
     * @param _imageUri URI to the impact image/metadata
     */
    function completeProject(
        uint256 _projectId,
        uint256 _impactValue,
        string memory _imageUri
    ) external onlyOwner {
        Project storage project = projects[_projectId];
        require(project.creator != address(0), "Project does not exist");
        require(!project.isComplete, "Project already completed");
        
        // Check if all milestones are paid
        bool allMilestonesPaid = true;
        for (uint256 i = 0; i < project.milestones.length; i++) {
            if (project.milestones[i].state != MilestoneState.Paid) {
                allMilestonesPaid = false;
                break;
            }
        }
        require(allMilestonesPaid, "Not all milestones are paid");
        
        project.isComplete = true;
        
        // Mint ImpactToken for the NGO
        uint256 tokenId = impactToken.mintImpactToken(
            project.creator,
            _projectId,
            project.projectName,
            project.description,
            _impactValue,
            _imageUri
        );
        
        emit ProjectCompleted(_projectId);
        emit ImpactTokenAwarded(_projectId, tokenId, project.creator);
    }
    
    /**
     * @dev Get project details
     * @param _projectId The ID of the project
     */
    function getProject(uint256 _projectId) external view returns (
        uint256 projectId,
        address creator,
        address donor,
        uint256 totalAmount,
        uint256 fundsRaised,
        bool isComplete,
        string memory projectName,
        string memory description,
        uint256 createdAt,
        uint256 milestoneCount
    ) {
        Project storage project = projects[_projectId];
        require(project.creator != address(0), "Project does not exist");
        
        return (
            project.projectId,
            project.creator,
            project.donor,
            project.totalAmount,
            project.fundsRaised,
            project.isComplete,
            project.projectName,
            project.description,
            project.createdAt,
            project.milestones.length
        );
    }
    
    /**
     * @dev Get milestone details
     * @param _projectId The ID of the project
     * @param _milestoneIndex The index of the milestone
     */
    function getMilestone(uint256 _projectId, uint256 _milestoneIndex) external view returns (
        string memory description,
        uint256 amount,
        MilestoneState state
    ) {
        Project storage project = projects[_projectId];
        require(project.creator != address(0), "Project does not exist");
        require(_milestoneIndex < project.milestones.length, "Invalid milestone index");
        
        Milestone storage milestone = project.milestones[_milestoneIndex];
        return (milestone.description, milestone.amount, milestone.state);
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency withdraw function (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
    }
}