import { useState, useEffect } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { CONTRACT_ADDRESSES, PROJECT_ESCROW_ABI, getProvider } from '../lib/contracts'
import { ethers } from 'ethers'

export interface Project {
  id: number
  name: string
  description: string
  creator: string
  donor: string
  totalAmount: string
  fundsRaised: string
  isComplete: boolean
  createdAt: number
  milestoneCount: number
  milestones?: Milestone[]
}

export interface Milestone {
  description: string
  amount: string
  state: number // 0: Pending, 1: Verified, 2: Paid
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  // Fetch all projects
  const fetchProjects = async () => {
    if (!publicClient) return

    try {
      setLoading(true)
      setError(null)

      const provider = getProvider()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.PROJECT_ESCROW,
        PROJECT_ESCROW_ABI,
        provider
      )

      const projectCount = await contract.projectCounter()
      const projectPromises = []

      for (let i = 1; i <= projectCount; i++) {
        projectPromises.push(contract.getProject(i))
      }

      const projectData = await Promise.all(projectPromises)
      const formattedProjects = projectData.map((project, index) => ({
        id: index + 1,
        name: project.projectName,
        description: project.description,
        creator: project.creator,
        donor: project.donor,
        totalAmount: ethers.formatEther(project.totalAmount),
        fundsRaised: ethers.formatEther(project.fundsRaised),
        isComplete: project.isComplete,
        createdAt: Number(project.createdAt),
        milestoneCount: Number(project.milestoneCount)
      }))

      setProjects(formattedProjects)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  // Create a new project
  const createProject = async (
    ngoAddress: string,
    milestoneAmounts: string[],
    milestoneDescriptions: string[],
    projectName: string,
    description: string
  ) => {
    if (!walletClient) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const provider = getProvider()
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.PROJECT_ESCROW,
        PROJECT_ESCROW_ABI,
        signer
      )

      // Convert amounts to wei
      const amountsInWei = milestoneAmounts.map(amount => 
        ethers.parseEther(amount)
      )

      const tx = await contract.createProject(
        ngoAddress,
        amountsInWei,
        milestoneDescriptions,
        projectName,
        description
      )

      await tx.wait()
      await fetchProjects() // Refresh the list
      return tx
    } catch (err) {
      console.error('Error creating project:', err)
      setError('Failed to create project')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Donate to a project
  const donateToProject = async (projectId: number, amount: string) => {
    if (!walletClient) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const provider = getProvider()
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.PROJECT_ESCROW,
        PROJECT_ESCROW_ABI,
        signer
      )

      const tx = await contract.donate(projectId, {
        value: ethers.parseEther(amount)
      })

      await tx.wait()
      await fetchProjects() // Refresh the list
      return tx
    } catch (err) {
      console.error('Error donating:', err)
      setError('Failed to donate')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Verify a milestone
  const verifyMilestone = async (projectId: number, milestoneIndex: number) => {
    if (!walletClient) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const provider = getProvider()
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.PROJECT_ESCROW,
        PROJECT_ESCROW_ABI,
        signer
      )

      const tx = await contract.verifyMilestone(projectId, milestoneIndex)
      await tx.wait()
      await fetchProjects() // Refresh the list
      return tx
    } catch (err) {
      console.error('Error verifying milestone:', err)
      setError('Failed to verify milestone')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pay a milestone
  const payMilestone = async (projectId: number, milestoneIndex: number) => {
    if (!walletClient) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const provider = getProvider()
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.PROJECT_ESCROW,
        PROJECT_ESCROW_ABI,
        signer
      )

      const tx = await contract.payMilestone(projectId, milestoneIndex)
      await tx.wait()
      await fetchProjects() // Refresh the list
      return tx
    } catch (err) {
      console.error('Error paying milestone:', err)
      setError('Failed to pay milestone')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Complete a project
  const completeProject = async (
    projectId: number,
    impactValue: number,
    imageUri: string
  ) => {
    if (!walletClient) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const provider = getProvider()
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.PROJECT_ESCROW,
        PROJECT_ESCROW_ABI,
        signer
      )

      const tx = await contract.completeProject(projectId, impactValue, imageUri)
      await tx.wait()
      await fetchProjects() // Refresh the list
      return tx
    } catch (err) {
      console.error('Error completing project:', err)
      setError('Failed to complete project')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch milestones for a project
  const fetchMilestones = async (projectId: number): Promise<Milestone[]> => {
    if (!publicClient) return []

    try {
      const provider = getProvider()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.PROJECT_ESCROW,
        PROJECT_ESCROW_ABI,
        provider
      )

      const project = await contract.getProject(projectId)
      const milestoneCount = Number(project.milestoneCount)
      const milestonePromises = []

      for (let i = 0; i < milestoneCount; i++) {
        milestonePromises.push(contract.getMilestone(projectId, i))
      }

      const milestoneData = await Promise.all(milestonePromises)
      return milestoneData.map(milestone => ({
        description: milestone.description,
        amount: ethers.formatEther(milestone.amount),
        state: Number(milestone.state)
      }))
    } catch (err) {
      console.error('Error fetching milestones:', err)
      return []
    }
  }

  useEffect(() => {
    if (publicClient) {
      fetchProjects()
    }
  }, [publicClient])

  return {
    projects,
    loading,
    error,
    createProject,
    donateToProject,
    verifyMilestone,
    payMilestone,
    completeProject,
    fetchMilestones,
    refreshProjects: fetchProjects
  }
}
