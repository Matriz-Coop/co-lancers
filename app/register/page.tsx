'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useEnsName, useEnsAddress } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Shield, 
  Star, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle,
  Briefcase,
  Award,
  Globe,
  Wallet
} from 'lucide-react'
import SubdomainSelector from '../../components/SubdomainSelector'
import WorldIdWidget from '../../components/WorldIdWidget'
import { ensSubdomainService } from '../../lib/ens-subdomain'
import { worldIdService, WorldIdProof } from '../../lib/world-id'

interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  verified: boolean
}

export default function Register() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [ensName, setEnsName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [isWorldIdVerified, setIsWorldIdVerified] = useState(false)
  const [worldIdProof, setWorldIdProof] = useState<WorldIdProof | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate' as const })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const { data: ensAddress } = useEnsAddress({
    name: ensName,
  })

  const { data: ensNameData } = useEnsName({
    address: address,
  })

  const handleWorldIdSuccess = async (proof: any) => {
    console.log('World ID verification received:', proof)
    
    // Validate the proof format
    if (!worldIdService.validateProof(proof)) {
      console.error('Invalid World ID proof format')
      alert('Invalid World ID proof. Please try again.')
      return
    }

    // Verify the proof
    const verificationResult = await worldIdService.verifyProof(proof)
    if (!verificationResult.success) {
      console.error('World ID verification failed:', verificationResult.error)
      alert(`World ID verification failed: ${verificationResult.error}`)
      return
    }

    // Mark the nullifier as used
    await worldIdService.markNullifierUsed(proof.nullifier_hash)
    
    setWorldIdProof(proof)
    setIsWorldIdVerified(true)
    setStep(2) // Move to ENS subdomain generation
  }

  const handleWorldIdError = (error: any) => {
    console.error('World ID verification failed:', error)
    setIsWorldIdVerified(false)
    alert('World ID verification failed. Please try again.')
  }

  const generateUniqueSubdomain = async () => {
    // Generate a unique subdomain based on World ID proof and wallet address
    if (!address || !worldIdProof) return

    try {
      // Use the ENS service to generate a unique subdomain
      const baseSubdomain = ensSubdomainService.generateUniqueSubdomain(address, worldIdProof)
      
      // Check if this subdomain is available, if not, try variations
      let finalSubdomain = baseSubdomain
      let counter = 1
      
      while (true) {
        const isAvailable = await ensSubdomainService.isSubdomainAvailable(finalSubdomain)
        if (isAvailable) {
          break
        }
        finalSubdomain = `${baseSubdomain}${counter}`
        counter++
      }
      
      setSubdomain(finalSubdomain)
    } catch (error) {
      console.error('Error generating unique subdomain:', error)
      // Fallback to a simple generation
      const fallbackSubdomain = `user${address.slice(2, 8)}${Date.now().toString(36)}`
      setSubdomain(fallbackSubdomain)
    }
  }

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        level: newSkill.level,
        verified: false
      }
      setSkills([...skills, skill])
      setNewSkill({ name: '', level: 'intermediate' })
    }
  }

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id))
  }

  const handleSubmit = async () => {
    if (!address || !subdomain || !isWorldIdVerified || skills.length === 0) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Register the subdomain with World ID verification
      const registrationResult = await ensSubdomainService.registerSubdomainWithWorldId(
        subdomain,
        address,
        worldIdProof,
        {
          description: `Co-Lancers freelancer with skills: ${skills.map(s => s.name).join(', ')}`,
          url: `https://colancer.eth/profile/${subdomain}`
        }
      )

      if (!registrationResult.success) {
        throw new Error(registrationResult.error || 'Failed to register subdomain')
      }

      console.log('Registration successful:', {
        address,
        subdomain,
        fullDomain: `${subdomain}.colancer.eth`,
        worldIdVerified: isWorldIdVerified,
        worldIdProof: worldIdProof.merkle_root,
        skills,
        txHash: registrationResult.txHash
      })

      // Here you would also:
      // 1. Store skills and verification status
      // 2. Initialize reputation system
      // 3. Create user profile

      // Simulate additional processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-generate subdomain when World ID is verified
  useEffect(() => {
    if (isWorldIdVerified && worldIdProof && !subdomain) {
      generateUniqueSubdomain()
    }
  }, [isWorldIdVerified, worldIdProof, subdomain])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <Wallet className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              Please connect your wallet to register for Co-Lancers
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <User className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Register for Co-Lancers</h1>
            <p className="text-gray-600">Complete your profile to join collaborative teams</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">World ID</span>
              </div>
              <div className="w-8 h-1 bg-gray-200"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">ENS Name</span>
              </div>
              <div className="w-8 h-1 bg-gray-200"></div>
              <div className={`flex items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Skills</span>
              </div>
            </div>
          </div>

          {/* Step 1: World ID Verification */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">World ID Verification</h3>
                <p className="text-gray-600 mb-6">
                  Verify your unique human identity to prevent duplicate registrations and ensure fair access
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">Why World ID?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensures one person, one account</li>
                    <li>• Prevents duplicate registrations</li>
                    <li>• Maintains platform integrity</li>
                    <li>• Enables fair reputation building</li>
                  </ul>
                </div>

                <WorldIdWidget
                  appId={worldIdService.getAppId()}
                  action="register"
                  signal={address ? worldIdService.generateSignal(address) : 'user_value'}
                  onSuccess={handleWorldIdSuccess}
                  onError={handleWorldIdError}
                >
                  {({ open }) => (
                    <button
                      onClick={open}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Verify with World ID
                    </button>
                  )}
                </WorldIdWidget>
              </div>
            </div>
          )}

          {/* Step 2: ENS Subdomain Generation */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Globe className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Unique ENS Name</h3>
                <p className="text-gray-600 mb-6">
                  A unique ENS subdomain has been generated for you under colancer.eth
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-900">Your ENS Name</h4>
                    <p className="text-2xl font-mono text-green-800 mt-2">
                      {subdomain ? `${subdomain}.colancer.eth` : 'Generating...'}
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      This name is unique and will be your identity on the platform
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">About Your ENS Name</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Automatically generated based on your World ID verification</li>
                  <li>• Unique across all colancer.eth subdomains</li>
                  <li>• Can be used for receiving payments and building reputation</li>
                  <li>• Fully owned and controlled by you</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(3)}
                  disabled={!subdomain}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Skills Management */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Your Skills</h3>
                
                {/* Add New Skill */}
                <div className="flex space-x-2 mb-6">
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="Skill name (e.g., React, Solidity, Design)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Skills List */}
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div>
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          <span className="ml-2 text-sm text-gray-500 capitalize">({skill.level})</span>
                        </div>
                        {skill.verified && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {skills.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Add your skills to get started
                  </p>
                )}

                {/* Submit Button */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={skills.length === 0 || isSubmitting}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 