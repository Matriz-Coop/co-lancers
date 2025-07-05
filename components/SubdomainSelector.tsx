'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader2, RefreshCw, Globe } from 'lucide-react'
import { ensSubdomainService } from '../lib/ens-subdomain'

interface SubdomainSelectorProps {
  onSubdomainSelected: (subdomain: string) => void
  currentSubdomain?: string
  disabled?: boolean
}

export default function SubdomainSelector({
  onSubdomainSelected,
  currentSubdomain = '',
  disabled = false
}: SubdomainSelectorProps) {
  const [subdomain, setSubdomain] = useState(currentSubdomain)
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Check availability when subdomain changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!subdomain || subdomain.length < 3) {
        setIsAvailable(null)
        return
      }

      setIsChecking(true)
      try {
        const available = await ensSubdomainService.isSubdomainAvailable(subdomain)
        setIsAvailable(available)
        if (available) {
          onSubdomainSelected(subdomain)
        }
      } catch (error) {
        console.error('Error checking subdomain availability:', error)
        setIsAvailable(false)
      } finally {
        setIsChecking(false)
      }
    }

    const debounceTimer = setTimeout(checkAvailability, 500)
    return () => clearTimeout(debounceTimer)
  }, [subdomain, onSubdomainSelected])

  // Generate suggestions when component mounts
  useEffect(() => {
    const generateSuggestions = () => {
      // You could get the user's name from a form or other source
      const userName = 'user' // This would come from user input
      const suggestions = ensSubdomainService.getSuggestedSubdomains(userName)
      setSuggestions(suggestions)
    }

    generateSuggestions()
  }, [])

  const handleSubdomainChange = (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSubdomain(cleanValue)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSubdomain(suggestion)
    setShowSuggestions(false)
  }

  const refreshSuggestions = () => {
    const userName = 'user' // This would come from user input
    const newSuggestions = ensSubdomainService.getSuggestedSubdomains(userName)
    setSuggestions(newSuggestions)
  }

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
    }
    
    if (isAvailable === null) {
      return <Globe className="h-4 w-4 text-gray-400" />
    }
    
    if (isAvailable) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    
    return <AlertCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusText = () => {
    if (isChecking) {
      return 'Checking availability...'
    }
    
    if (isAvailable === null) {
      return 'Enter a subdomain'
    }
    
    if (isAvailable) {
      return 'Available!'
    }
    
    return 'Already taken'
  }

  const getStatusColor = () => {
    if (isChecking) {
      return 'text-gray-500'
    }
    
    if (isAvailable === null) {
      return 'text-gray-500'
    }
    
    if (isAvailable) {
      return 'text-green-600'
    }
    
    return 'text-red-600'
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose Your Subdomain
        </label>
        <div className="relative">
          <div className="flex">
            <input
              type="text"
              value={subdomain}
              onChange={(e) => handleSubdomainChange(e.target.value)}
              placeholder="yourname"
              disabled={disabled}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div className="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-gray-500 text-sm flex items-center">
              .colancer.eth
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center mt-2 space-x-2">
            {getStatusIcon()}
            <span className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Suggestions</span>
          <button
            onClick={refreshSuggestions}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Subdomain rules */}
      <div className="bg-blue-50 p-3 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Subdomain Rules</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• 3-63 characters long</li>
          <li>• Only lowercase letters, numbers, and hyphens</li>
          <li>• Cannot start or end with hyphen</li>
          <li>• Cannot have consecutive hyphens</li>
          <li>• Must be unique across all co-lancers.eth subdomains</li>
        </ul>
      </div>

      {/* Preview */}
      {subdomain && (
        <div className="bg-gray-50 p-3 rounded-md">
          <span className="text-sm text-gray-600">Your ENS name will be:</span>
          <div className="text-lg font-mono text-gray-900 mt-1">
            {subdomain}.co-lancers.eth
          </div>
        </div>
      )}
    </div>
  )
} 