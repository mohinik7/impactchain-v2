import { useContractRead, useContractWrite, useSimulateContract } from 'wagmi'
import { contractConfig } from '../config/contracts'
import { parseEther } from 'viem'

const IMPACT_TOKEN_ABI = [
  'function safeMint(address to, uint256 tokenId, string memory tokenURI) external',
  'function tokenMetadata(uint256 tokenId) external view returns (tuple(uint256 projectId, string projectName, string description, uint256 impactValue, string imageUri, uint256 timestamp, address recipient))',
  'function getTokensByOwner(address owner) external view returns (uint256[])',
]

const PROJECT_ESCROW_ABI = [
  'function projectCounter() external view returns (uint256)',
  'function getProject(uint256 _projectId) external view returns (uint256 projectId, address creator, address donor, uint256 totalAmount, uint256 fundsRaised, bool isComplete, string projectName, string description, uint256 createdAt, uint256 milestoneCount)',
  'function donate(uint256 _projectId) external payable',
  'function verifyMilestone(uint256 _projectId, uint256 _milestoneIndex) external',
  'function getMilestone(uint256 _projectId, uint256 _milestoneIndex) external view returns (tuple(string description, uint256 amount, uint8 state))',
  'function owner() external view returns (address)',
]

export function useProjectCount() {
  return useContractRead({
    address: contractConfig.addresses.projectEscrow as `0x${string}`,
    abi: PROJECT_ESCROW_ABI,
    functionName: 'projectCounter',
  })
}

export function useProjectDetails(projectId: number) {
  return useContractRead({
    address: contractConfig.addresses.projectEscrow as `0x${string}`,
    abi: PROJECT_ESCROW_ABI,
    functionName: 'getProject',
    args: [BigInt(projectId)],
  })
}

export function useDonateToProject(projectId: number, amount: string) {
  const { data: simulationData } = useSimulateContract({
    address: contractConfig.addresses.projectEscrow as `0x${string}`,
    abi: PROJECT_ESCROW_ABI,
    functionName: 'donate',
    args: [BigInt(projectId)],
    value: parseEther(amount),
  })
  
  return useContractWrite(simulationData)
}

export function useVerifyMilestone(projectId: number, milestoneIndex: number) {
  const { data: simulationData } = useSimulateContract({
    address: contractConfig.addresses.projectEscrow as `0x${string}`,
    abi: PROJECT_ESCROW_ABI,
    functionName: 'verifyMilestone',
    args: [BigInt(projectId), BigInt(milestoneIndex)],
  })
  
  return useContractWrite(simulationData)
}

export function useMilestoneDetails(projectId: number, milestoneIndex: number) {
  return useContractRead({
    address: contractConfig.addresses.projectEscrow as `0x${string}`,
    abi: PROJECT_ESCROW_ABI,
    functionName: 'getMilestone',
    args: [BigInt(projectId), BigInt(milestoneIndex)],
  })
}

export function useIsContractOwner(address?: string) {
  return useContractRead({
    address: contractConfig.addresses.projectEscrow as `0x${string}`,
    abi: PROJECT_ESCROW_ABI,
    functionName: 'owner',
    select: (data: string) => data.toLowerCase() === address?.toLowerCase(),
  })
}

export function useImpactToken(tokenId: number) {
  return useContractRead({
    address: contractConfig.addresses.impactToken as `0x${string}`,
    abi: IMPACT_TOKEN_ABI,
    functionName: 'tokenMetadata',
    args: [BigInt(tokenId)],
  })
}

export function useImpactTokensForOwner(ownerAddress: string) {
  return useContractRead({
    address: contractConfig.addresses.impactToken as `0x${string}`,
    abi: IMPACT_TOKEN_ABI,
    functionName: 'getTokensByOwner',
    args: [ownerAddress as `0x${string}`],
  })
}