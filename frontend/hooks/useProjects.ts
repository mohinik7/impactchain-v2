'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useWeb3 } from '../contexts/web3Context'

export interface Project {
  id: number
  name: string
  description: string
  creator: string
  donor: string
  totalAmount: bigint
  fundsRaised: bigint
  isComplete: boolean
  createdAt: bigint
}

export interface Milestone {
  description: string
  amount: bigint
  state: number // 0: Pending, 1: Verified, 2: Paid
}

export function useProjects() {
  const { address } = useAccount()
  const { contractService } = useWeb3()
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setLoading] = useState(false)

  // Load all projects
  useEffect(() => {
    const load = async () => {
      if (!contractService) return
      try {
        setLoading(true)
        setError(null)
        const count: number = await contractService.getProjectCount()
        const list: Project[] = []
        for (let id = 1; id <= Number(count); id++) {
          const p: any = await contractService.getProjectDetails(id)
          list.push({
            id: Number(p.projectId ?? id),
            name: p.projectName,
            description: p.description,
            creator: p.creator,
            donor: p.donor,
            totalAmount: p.totalAmount,
            fundsRaised: p.fundsRaised,
            isComplete: p.isComplete,
            createdAt: p.createdAt,
          })
        }
        setProjects(list)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [contractService])

  const handleCreateProject = async (
    ngoAddress: string,
    milestoneAmounts: string[],
    milestoneDescriptions: string[],
    projectName: string,
    description: string
  ) => {
    try {
      console.log('Creating project with params:', {
        ngoAddress,
        milestoneAmounts,
        milestoneDescriptions,
        projectName,
        description
      })

      setError(null)
      if (!contractService) throw new Error('Wallet not connected')
      const receipt = await contractService.createProject(
        ngoAddress,
        milestoneAmounts,
        milestoneDescriptions,
        projectName,
        description
      )
      // Reload list after success
      const count: number = await contractService.getProjectCount()
      const list: Project[] = []
      for (let id = 1; id <= Number(count); id++) {
        const p: any = await contractService.getProjectDetails(id)
        list.push({
          id: Number(p.projectId ?? id),
          name: p.projectName,
          description: p.description,
          creator: p.creator,
          donor: p.donor,
          totalAmount: p.totalAmount,
          fundsRaised: p.fundsRaised,
          isComplete: p.isComplete,
          createdAt: p.createdAt,
        })
      }
      setProjects(list)
      return receipt
    } catch (err) {
      console.error('Error creating project:', err)
      setError(err instanceof Error ? err.message : 'Failed to create project')
      throw err
    }
  }

  // Donate to project
  const handleDonation = async (projectId: number, amount: string) => {
    try {
      setError(null)
      if (!contractService) throw new Error('Wallet not connected')
      await contractService.donateToProject(projectId, amount)
    } catch (err) {
      console.error('Error donating:', err)
      setError(err instanceof Error ? err.message : 'Failed to donate')
    }
  }

  // Verify milestone
  const handleVerifyMilestone = async (projectId: number, milestoneIndex: number) => {
    try {
      setError(null)
      if (!contractService) throw new Error('Wallet not connected')
      await contractService.verifyMilestone(projectId, milestoneIndex)
    } catch (err) {
      console.error('Error verifying milestone:', err)
      setError(err instanceof Error ? err.message : 'Failed to verify milestone')
    }
  }

  return {
    projects,
    isLoading,
    error,
    createProject: handleCreateProject,
    donateToProject: handleDonation,
    verifyMilestone: handleVerifyMilestone,
  }
}