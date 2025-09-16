'use client'

import { useAccount } from 'wagmi'
import { useProjectCount, useProjectDetails } from '../hooks/useContracts'

export default function TestComponent() {
  // Get connected account
  const { address, isConnected } = useAccount()
  
  // Get total number of projects
  const { data: projectCount, isLoading: isLoadingCount } = useProjectCount()
  
  // Get first project details if we have projects
  const { data: firstProject, isLoading: isLoadingProject } = useProjectDetails(0)

  if (!isConnected) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Please connect your wallet</h1>
      </div>
    )
  }

  if (isLoadingCount || isLoadingProject) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Contract Integration Test</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Connected Account</h2>
        <p className="font-mono">{address}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Total Projects</h2>
        <p>{projectCount?.toString() || '0'}</p>
      </div>

      {firstProject && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">First Project Details</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p><strong>Name:</strong> {firstProject.projectName}</p>
            <p><strong>Creator:</strong> {firstProject.creator}</p>
            <p><strong>Total Amount:</strong> {firstProject.totalAmount.toString()} ETH</p>
            <p><strong>Funds Raised:</strong> {firstProject.fundsRaised.toString()} ETH</p>
            <p><strong>Status:</strong> {firstProject.isComplete ? 'Completed' : 'In Progress'}</p>
          </div>
        </div>
      )}
    </div>
  )
}