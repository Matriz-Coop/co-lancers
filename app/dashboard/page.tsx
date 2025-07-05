'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useEnsName } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  User, 
  Star, 
  Briefcase, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Edit,
  Eye,
  DollarSign,
  Users,
  Calendar,
  MapPin
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'pending'
  earnings: number
  teamSize: number
  startDate: string
  endDate?: string
  skills: string[]
}

interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  verified: boolean
  endorsements: number
}

interface Reputation {
  score: number
  reviews: number
  completedProjects: number
  totalEarnings: number
}

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({
    address: address,
  })

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', level: 'advanced', verified: true, endorsements: 12 },
    { id: '2', name: 'Solidity', level: 'intermediate', verified: false, endorsements: 5 },
    { id: '3', name: 'UI/UX Design', level: 'expert', verified: true, endorsements: 8 },
  ])

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'DeFi Dashboard',
      description: 'Built a comprehensive DeFi dashboard with real-time data visualization',
      status: 'completed',
      earnings: 2500,
      teamSize: 4,
      startDate: '2024-01-15',
      endDate: '2024-03-20',
      skills: ['React', 'Solidity', 'Web3.js']
    },
    {
      id: '2',
      title: 'NFT Marketplace',
      description: 'Developed a full-stack NFT marketplace with minting and trading features',
      status: 'active',
      earnings: 1800,
      teamSize: 3,
      startDate: '2024-04-01',
      skills: ['Next.js', 'Solidity', 'IPFS']
    }
  ])

  const [reputation] = useState<Reputation>({
    score: 4.8,
    reviews: 15,
    completedProjects: 8,
    totalEarnings: 12500
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state during SSR and initial hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Co-Lancers Dashboard</h1>
              </div>
              <ConnectButton />
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <User className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              Please connect your wallet to access your dashboard
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Co-Lancers Dashboard</h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {ensName ? `${ensName}.colancer.eth` : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
              </h2>
              <p className="text-gray-600">Freelancer • {address}</p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600">{reputation.score}/5.0 ({reputation.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">${reputation.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{reputation.completedProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skills</p>
                <p className="text-2xl font-semibold text-gray-900">{skills.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reputation Score</p>
                <p className="text-2xl font-semibold text-gray-900">{reputation.score}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: Eye },
                { id: 'skills', name: 'Skills', icon: Star },
                { id: 'projects', name: 'Projects', icon: Briefcase },
                { id: 'reputation', name: 'Reputation', icon: Award },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">{project.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-xs text-gray-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {project.startDate}
                            </span>
                            <span className="text-xs text-gray-500">
                              <Users className="h-3 w-3 inline mr-1" />
                              {project.teamSize} members
                            </span>
                            <span className="text-xs text-gray-500">
                              <DollarSign className="h-3 w-3 inline mr-1" />
                              ${project.earnings}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Your Skills</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2 inline" />
                    Add Skill
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{skill.name}</h4>
                        {skill.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{skill.level}</span>
                        <span className="text-sm text-gray-500">{skill.endorsements} endorsements</span>
                      </div>
                      {!skill.verified && (
                        <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-700">
                          Verify with Flare FDC
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Your Projects</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2 inline" />
                    New Project
                  </button>
                </div>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h4>
                          <p className="text-gray-600 mb-4">{project.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span>
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {project.startDate} - {project.endDate || 'Ongoing'}
                            </span>
                            <span>
                              <Users className="h-4 w-4 inline mr-1" />
                              {project.teamSize} team members
                            </span>
                            <span>
                              <DollarSign className="h-4 w-4 inline mr-1" />
                              ${project.earnings}
                            </span>
                          </div>
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Skills Used:</h5>
                            <div className="flex flex-wrap gap-2">
                              {project.skills.map((skill) => (
                                <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reputation Tab */}
            {activeTab === 'reputation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Reputation Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-4">Overall Score</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold text-indigo-600">{reputation.score}</div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(reputation.score) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Based on {reputation.reviews} reviews</p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-4">Earnings History</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Earnings</span>
                          <span className="font-medium">${reputation.totalEarnings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Completed Projects</span>
                          <span className="font-medium">{reputation.completedProjects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Average per Project</span>
                          <span className="font-medium">
                            ${Math.round(reputation.totalEarnings / reputation.completedProjects)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Recent Reviews</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 ${
                                    j < 4 ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">Client {i}</span>
                          </div>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Excellent work on the DeFi dashboard project. Very professional and delivered on time.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 