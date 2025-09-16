'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatEther } from 'viem'
import { useWeb3 } from '../contexts/web3Context'

interface Project {
  projectId: bigint
  creator: string
  donor: string
  totalAmount: bigint
  fundsRaised: bigint
  isComplete: boolean
  projectName: string
  description: string
  createdAt: bigint
}

export default function NGOdiscovery() {
  const router = useRouter()
  const { contractService } = useWeb3()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        if (!contractService) return
        setIsLoading(true)
        setError(null)
        const count = await contractService.getProjectCount()
        const items: Project[] = []
        for (let id = 1; id <= Number(count); id++) {
          const p = await contractService.getProjectDetails(id)
          items.push(p as Project)
        }
        setProjects(items)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load projects')
      } finally {
        setIsLoading(false)
      }
    }
    loadProjects()
  }, [contractService])

  const calculateProgress = (fundsRaised: bigint, totalAmount: bigint) => {
    if (totalAmount === BigInt(0)) return 0
    return Number((fundsRaised * BigInt(100)) / totalAmount)
  }

  const handleDonateClick = (projectId: number) => {
    router.push(`/donate/${projectId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>Error loading projects.</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  const hasProjects = projects && projects.length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Available NGO Projects</h1>
      {!hasProjects ? (
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No Projects Yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{project.projectName}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${calculateProgress(project.fundsRaised, project.totalAmount)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>
                      {formatEther(project.fundsRaised)} ETH raised
                    </span>
                    <span>
                      {formatEther(project.totalAmount)} ETH goal
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDonateClick(Number(project.projectId))}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                  Donate Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}