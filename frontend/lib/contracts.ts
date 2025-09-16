import { ethers } from 'ethers'

// Contract ABIs (simplified versions)
export const IMPACT_TOKEN_ABI = [
  "function mintImpactToken(address to, uint256 projectId, string memory projectName, string memory description, uint256 impactValue, string memory imageUri) external returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function getTokenMetadata(uint256 tokenId) external view returns (tuple(uint256 projectId, string projectName, string description, uint256 impactValue, string imageUri, uint256 timestamp, address recipient))",
  "function getTokensByOwner(address owner) external view returns (uint256[] memory)"
]

export const PROJECT_ESCROW_ABI = [
  "function createProject(address payable _ngo, uint256[] memory _milestoneAmounts, string[] memory _milestoneDescriptions, string memory _projectName, string memory _description) external",
  "function donate(uint256 _projectId) external payable",
  "function verifyMilestone(uint256 _projectId, uint256 _milestoneIndex) external",
  "function payMilestone(uint256 _projectId, uint256 _milestoneIndex) external",
  "function completeProject(uint256 _projectId, uint256 _impactValue, string memory _imageUri) external",
  "function getProject(uint256 _projectId) external view returns (tuple(uint256 projectId, address creator, address donor, uint256 totalAmount, uint256 fundsRaised, bool isComplete, string projectName, string description, uint256 createdAt, uint256 milestoneCount))",
  "function getMilestone(uint256 _projectId, uint256 _milestoneIndex) external view returns (tuple(string description, uint256 amount, uint8 state))",
  "function projectCounter() external view returns (uint256)",
  "function projects(uint256) external view returns (tuple(uint256 projectId, address creator, address donor, uint256 totalAmount, uint256 fundsRaised, bool isComplete, string projectName, string description, uint256 createdAt))",
  "event ProjectCreated(uint256 indexed projectId, address indexed creator, uint256 totalAmount)",
  "event ProjectFunded(uint256 indexed projectId, address indexed donor, uint256 amount)",
  "event MilestoneVerified(uint256 indexed projectId, uint256 indexed milestoneIndex)",
  "event MilestonePaid(uint256 indexed projectId, uint256 indexed milestoneIndex, uint256 amount)",
  "event ProjectCompleted(uint256 indexed projectId)",
  "event ImpactTokenAwarded(uint256 indexed projectId, uint256 indexed tokenId, address indexed recipient)"
]

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  IMPACT_TOKEN: process.env.NEXT_PUBLIC_IMPACT_TOKEN_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  PROJECT_ESCROW: process.env.NEXT_PUBLIC_PROJECT_ESCROW_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
}

// Helper function to get contract instance
export function getContract(address: string, abi: any[], signer: ethers.Signer) {
  return new ethers.Contract(address, abi, signer)
}

// Helper function to get provider
export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return new ethers.JsonRpcProvider('http://127.0.0.1:8545')
}
