'use client'

import React, { useState } from 'react'
import { CheckCircle, AlertCircle, Loader2, Star } from 'lucide-react'
import { flareFDCService, SkillVerificationRequest } from '../lib/flare-fdc'

interface SkillVerificationProps {
  skillName: string
  skillLevel: string
  walletAddress: string
  ensName: string
  onVerificationComplete: (verified: boolean) => void
}

export default function SkillVerification({
  skillName,
  skillLevel,
  walletAddress,
  ensName,
  onVerificationComplete
}: SkillVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const handleVerification = async () => {
    setIsVerifying(true)
    
    try {
      const request: SkillVerificationRequest = {
        skillName,
        skillLevel,
        walletAddress,
        ensName
      }

      const result = await flareFDCService.verifySkill(request)
      setVerificationResult(result)
      onVerificationComplete(result.verified)
    } catch (error) {
      console.error('Skill verification failed:', error)
      setVerificationResult({ verified: false, error: 'Verification failed' })
      onVerificationComplete(false)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <div>
            <h4 className="font-medium text-gray-900">{skillName}</h4>
            <p className="text-sm text-gray-500 capitalize">{skillLevel} level</p>
          </div>
        </div>
        
        {verificationResult ? (
          verificationResult.verified ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-500" />
        )}
      </div>

      {verificationResult && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {verificationResult.verified ? 'Verified' : 'Not Verified'}
            </span>
            {verificationResult.confidence && (
              <span className="text-sm text-gray-500">
                Confidence: {Math.round(verificationResult.confidence * 100)}%
              </span>
            )}
          </div>
          {verificationResult.verificationMethod && (
            <p className="text-xs text-gray-500 mt-1">
              Method: {verificationResult.verificationMethod}
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleVerification}
        disabled={isVerifying}
        className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
          isVerifying
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : verificationResult?.verified
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isVerifying ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Verifying...
          </div>
        ) : verificationResult?.verified ? (
          'Verified ✓'
        ) : (
          'Verify with Flare FDC'
        )}
      </button>
    </div>
  )
} 