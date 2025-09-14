'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useProjects, Project, Milestone } from '../hooks/useProjects'
import { 
  Plus, 
  Heart, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Eye,
  User,
  Building,
  Award
} from 'lucide-react'

export default function ProjectManager() {
  const { address, isConnected } = useAccount()
  const {
    projects,
    loading,
    error,
    createProject,
    donateToProject,
    verifyMilestone,
    payMilestone,
    completeProject,
    fetchMilestones
  } = useProjects()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [donationAmount, setDonationAmount] = useState('')
  const [impactValue, setImpactValue] = useState('')
  const [imageUri, setImageUri] = useState('')

  // Create Project Form State
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [ngoAddress, setNgoAddress] = useState('')
  const [milestoneAmounts, setMilestoneAmounts] = useState([''])
  const [milestoneDescriptions, setMilestoneDescriptions] = useState([''])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProject(
        ngoAddress,
        milestoneAmounts.filter(amount => amount.trim() !== ''),
        milestoneDescriptions.filter(desc => desc.trim() !== ''),
        projectName,
        projectDescription
      )
      setShowCreateForm(false)
      // Reset form
      setProjectName('')
      setProjectDescription('')
      setNgoAddress('')
      setMilestoneAmounts([''])
      setMilestoneDescriptions([''])
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleDonate = async (projectId: number) => {
    if (!donationAmount) return
    try {
      await donateToProject(projectId, donationAmount)
      setDonationAmount('')
    } catch (error) {
      console.error('Failed to donate:', error)
    }
  }

  const handleVerifyMilestone = async (projectId: number, milestoneIndex: number) => {
    try {
      await verifyMilestone(projectId, milestoneIndex)
      // Refresh milestones
      const updatedMilestones = await fetchMilestones(projectId)
      setMilestones(updatedMilestones)
    } catch (error) {
      console.error('Failed to verify milestone:', error)
    }
  }

  const handlePayMilestone = async (projectId: number, milestoneIndex: number) => {
    try {
      await payMilestone(projectId, milestoneIndex)
      // Refresh milestones
      const updatedMilestones = await fetchMilestones(projectId)
      setMilestones(updatedMilestones)
    } catch (error) {
      console.error('Failed to pay milestone:', error)
    }
  }

  const handleCompleteProject = async (projectId: number) => {
    if (!impactValue || !imageUri) return
    try {
      await completeProject(projectId, parseInt(impactValue), imageUri)
      setImpactValue('')
      setImageUri('')
      setSelectedProject(null)
    } catch (error) {
      console.error('Failed to complete project:', error)
    }
  }

  const viewProjectDetails = async (project: Project) => {
    setSelectedProject(project)
    const projectMilestones = await fetchMilestones(project.id)
    setMilestones(projectMilestones)
  }

  const addMilestone = () => {
    setMilestoneAmounts([...milestoneAmounts, ''])
    setMilestoneDescriptions([...milestoneDescriptions, ''])
  }

  const removeMilestone = (index: number) => {
    setMilestoneAmounts(milestoneAmounts.filter((_, i) => i !== index))
    setMilestoneDescriptions(milestoneDescriptions.filter((_, i) => i !== index))
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600">
          Please connect your wallet to interact with projects
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-2">
            Manage impact projects and track donations
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Project
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="input-field h-20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NGO Address
                </label>
                <input
                  type="text"
                  value={ngoAddress}
                  onChange={(e) => setNgoAddress(e.target.value)}
                  className="input-field"
                  placeholder="0x..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milestones
                </label>
                {milestoneAmounts.map((amount, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        const newAmounts = [...milestoneAmounts]
                        newAmounts[index] = e.target.value
                        setMilestoneAmounts(newAmounts)
                      }}
                      className="input-field flex-1"
                      placeholder="Amount in ETH"
                      required
                    />
                    <input
                      type="text"
                      value={milestoneDescriptions[index]}
                      onChange={(e) => {
                        const newDescriptions = [...milestoneDescriptions]
                        newDescriptions[index] = e.target.value
                        setMilestoneDescriptions(newDescriptions)
                      }}
                      className="input-field flex-2"
                      placeholder="Milestone description"
                      required
                    />
                    {milestoneAmounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="btn-secondary px-3"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMilestone}
                  className="btn-secondary text-sm"
                >
                  Add Milestone
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                <p className="text-gray-600 mt-2">{selectedProject.description}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Info */}
              <div className="space-y-4">
                <div className="card">
                  <h3 className="font-semibold mb-3">Project Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creator:</span>
                      <span className="font-mono text-xs">{selectedProject.creator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span>{selectedProject.totalAmount} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Funds Raised:</span>
                      <span>{selectedProject.fundsRaised} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={selectedProject.isComplete ? 'text-green-600' : 'text-blue-600'}>
                        {selectedProject.isComplete ? 'Completed' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Donation Section */}
                {!selectedProject.isComplete && (
                  <div className="card">
                    <h3 className="font-semibold mb-3">Make Donation</h3>
                    <div className="space-y-3">
                      <input
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="input-field"
                        placeholder="Amount in ETH"
                        step="0.01"
                        min="0"
                      />
                      <button
                        onClick={() => handleDonate(selectedProject.id)}
                        className="btn-primary w-full"
                        disabled={!donationAmount || loading}
                      >
                        <Heart className="h-4 w-4 mr-2 inline" />
                        Donate
                      </button>
                    </div>
                  </div>
                )}

                {/* Complete Project Section */}
                {selectedProject.creator.toLowerCase() === address?.toLowerCase() && 
                 !selectedProject.isComplete && (
                  <div className="card">
                    <h3 className="font-semibold mb-3">Complete Project</h3>
                    <div className="space-y-3">
                      <input
                        type="number"
                        value={impactValue}
                        onChange={(e) => setImpactValue(e.target.value)}
                        className="input-field"
                        placeholder="Impact Value"
                      />
                      <input
                        type="text"
                        value={imageUri}
                        onChange={(e) => setImageUri(e.target.value)}
                        className="input-field"
                        placeholder="Image URI"
                      />
                      <button
                        onClick={() => handleCompleteProject(selectedProject.id)}
                        className="btn-primary w-full"
                        disabled={!impactValue || !imageUri || loading}
                      >
                        <Award className="h-4 w-4 mr-2 inline" />
                        Complete & Mint Token
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Milestones */}
              <div className="card">
                <h3 className="font-semibold mb-3">Milestones</h3>
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{milestone.description}</span>
                        <span className="text-sm text-gray-600">{milestone.amount} ETH</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm px-2 py-1 rounded ${
                          milestone.state === 0 ? 'bg-yellow-100 text-yellow-800' :
                          milestone.state === 1 ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {milestone.state === 0 ? 'Pending' :
                           milestone.state === 1 ? 'Verified' : 'Paid'}
                        </span>
                        {address?.toLowerCase() === selectedProject.creator.toLowerCase() && (
                          <div className="flex gap-2">
                            {milestone.state === 0 && (
                              <button
                                onClick={() => handleVerifyMilestone(selectedProject.id, index)}
                                className="btn-secondary text-xs px-2 py-1"
                                disabled={loading}
                              >
                                Verify
                              </button>
                            )}
                            {milestone.state === 1 && (
                              <button
                                onClick={() => handlePayMilestone(selectedProject.id, index)}
                                className="btn-primary text-xs px-2 py-1"
                                disabled={loading}
                              >
                                Pay
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-600">
              Create your first project to get started
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {project.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.isComplete 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {project.isComplete ? 'Completed' : 'Active'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">
                    {Math.round((parseFloat(project.fundsRaised) / parseFloat(project.totalAmount)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(parseFloat(project.fundsRaised) / parseFloat(project.totalAmount)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {parseFloat(project.fundsRaised).toFixed(2)} ETH raised
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {project.milestoneCount} milestones
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => viewProjectDetails(project)}
                  className="btn-primary flex-1"
                >
                  <Eye className="h-4 w-4 mr-2 inline" />
                  View Details
                </button>
                {!project.isComplete && (
                  <button
                    onClick={() => {
                      setSelectedProject(project)
                      setDonationAmount('')
                    }}
                    className="btn-secondary"
                  >
                    Donate
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
