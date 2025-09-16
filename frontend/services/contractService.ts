import { Contract, type Provider, type Signer, parseEther } from 'ethers'
import { contractConfig } from '../config/contracts'
import { IMPACT_TOKEN_ABI, PROJECT_ESCROW_ABI } from '../lib/contracts'

export class ContractService {
  private signerOrProvider: Signer | Provider | null = null
  private impactToken: Contract | null = null
  private projectEscrow: Contract | null = null
  private impactTokenConfig = {
    address: contractConfig.addresses.impactToken as `0x${string}`,
    abi: IMPACT_TOKEN_ABI,
  }

  private projectEscrowConfig = {
    address: contractConfig.addresses.projectEscrow as `0x${string}`,
    abi: PROJECT_ESCROW_ABI,
  }

  constructor(signerOrProvider?: Signer | Provider) {
    if (signerOrProvider) {
      this.init(signerOrProvider);
    }
  }

  init(signerOrProvider: Signer | Provider) {
    this.signerOrProvider = signerOrProvider;
    this.impactToken = new Contract(
      contractConfig.addresses.impactToken!,
      IMPACT_TOKEN_ABI,
      signerOrProvider
    );
    this.projectEscrow = new Contract(
      contractConfig.addresses.projectEscrow!,
      PROJECT_ESCROW_ABI,
      signerOrProvider
    );
  }

  // Project Escrow Functions
  async getProjectCount(): Promise<number> {
    if (!this.projectEscrow) throw new Error('Contract not initialized');
    return await this.projectEscrow.projectCounter();
  }

  async getProjectDetails(projectId: number) {
    if (!this.projectEscrow) throw new Error('Contract not initialized');
    const result = await this.projectEscrow.getProject(projectId);
    // Normalize to a consistent object with named properties
    return {
      projectId: result[0],
      creator: result[1],
      donor: result[2],
      totalAmount: result[3],
      fundsRaised: result[4],
      isComplete: result[5],
      projectName: result[6],
      description: result[7],
      createdAt: result[8],
      milestoneCount: result[9],
    } as any;
  }

  async donateToProject(projectId: number, amount: string) {
    if (!this.projectEscrow) throw new Error('Contract not initialized');
    const tx = await this.projectEscrow.donate(projectId, {
      value: parseEther(amount),
    });
    return await tx.wait();
  }

  async verifyMilestone(projectId: number, milestoneIndex: number) {
    if (!this.projectEscrow) throw new Error('Contract not initialized');
    const tx = await this.projectEscrow.verifyMilestone(projectId, milestoneIndex);
    return await tx.wait();
  }

  async getMilestone(projectId: number, milestoneIndex: number) {
    if (!this.projectEscrow) throw new Error('Contract not initialized');
    return await this.projectEscrow.getMilestone(projectId, milestoneIndex);
  }

  async isContractOwner(address: string): Promise<boolean> {
    if (!this.projectEscrow) throw new Error('Contract not initialized');
    const owner = await this.projectEscrow.owner();
    return owner.toLowerCase() === address.toLowerCase();
  }

  async createProject(
    ngoAddress: string,
    milestoneAmountsEth: string[],
    milestoneDescriptions: string[],
    projectName: string,
    description: string
  ) {
    if (!this.projectEscrow) throw new Error('Contract not initialized');
    const weiAmounts = milestoneAmountsEth.map((amt) => parseEther(amt));
    const tx = await this.projectEscrow.createProject(
      ngoAddress,
      weiAmounts,
      milestoneDescriptions,
      projectName,
      description
    );
    return await tx.wait();
  }

  // Impact Token Functions
  async getImpactToken(tokenId: number) {
    if (!this.impactToken) throw new Error('Contract not initialized');
    return await this.impactToken.getTokenMetadata(tokenId);
  }

  async getImpactTokensForOwner(ownerAddress: string) {
    if (!this.impactToken) throw new Error('Contract not initialized');
    return await this.impactToken.getTokensByOwner(ownerAddress);
  }
}