'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { 
  Heart, 
  Users, 
  TrendingUp, 
  Shield, 
  Plus, 
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  Award
} from 'lucide-react'
import ProjectManager from '../components/ProjectManager'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'home' | 'projects'>('home')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-primary-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">ImpactChain</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'home'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'projects'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Projects
                </button>
              </nav>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {activeTab === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">
                  Transparent Impact Measurement
                </h2>
                <p className="text-xl mb-8 max-w-3xl mx-auto">
                  Connect NGOs with donors through blockchain technology. 
                  Track impact, verify milestones, and ensure transparent fund distribution.
                </p>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
                  >
                    <Plus className="h-5 w-5 mr-2 inline" />
                    Create Project
                  </button>
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-primary-600"
                  >
                    <Eye className="h-5 w-5 mr-2 inline" />
                    Browse Projects
                  </button>
                </div>
              </div>
            </div>
          </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">150+</h3>
              <p className="text-gray-600">Active NGOs</p>
            </div>
            <div className="text-center">
              <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">$2.5M</h3>
              <p className="text-gray-600">Funds Raised</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">100%</h3>
              <p className="text-gray-600">Transparent</p>
            </div>
          </div>
        </div>
      </section>

          {/* Projects Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-gray-600">
                  A simple 3-step process for transparent impact measurement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Building className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Create Project</h3>
                  <p className="text-gray-600">NGOs create projects with milestones and funding goals</p>
                </div>
                <div className="text-center">
                  <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-success-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Donate & Verify</h3>
                  <p className="text-gray-600">Donors fund projects and milestones are verified</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Earn Impact Tokens</h3>
                  <p className="text-gray-600">Complete projects earn NFT tokens representing impact</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <ProjectManager />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-primary-400 mr-2" />
                <span className="text-xl font-bold">ImpactChain</span>
              </div>
              <p className="text-gray-400">
                Transparent impact measurement through blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">For NGOs</a></li>
                <li><a href="#" className="hover:text-white">For Donors</a></li>
                <li><a href="#" className="hover:text-white">Impact Tokens</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ImpactChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
