'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the World ID widget with proper error handling
const WorldIdWidgetComponent = dynamic(
  () => import('@worldcoin/id').then((mod) => ({ default: mod.IDKitWidget })),
  {
    ssr: false,
    loading: () => <div className="px-8 py-3 bg-gray-300 text-gray-600 rounded-md">Loading World ID...</div>
  }
)

interface WorldIdWidgetProps {
  appId: string
  action: string
  signal: string
  onSuccess: (proof: any) => void
  onError: (error: any) => void
  children: (props: { open: () => void }) => React.ReactNode
}

export default function WorldIdWidget({
  appId,
  action,
  signal,
  onSuccess,
  onError,
  children
}: WorldIdWidgetProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Set loaded after a short delay to ensure the component is ready
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <div className="px-8 py-3 bg-red-100 text-red-600 rounded-md">
        Error loading World ID: {error}
      </div>
    )
  }

  if (!isLoaded) {
    return <div className="px-8 py-3 bg-gray-300 text-gray-600 rounded-md">Loading World ID...</div>
  }

  return (
    <WorldIdWidgetComponent
      app_id={appId}
      action={action}
      signal={signal}
      onSuccess={onSuccess}
      onError={(err) => {
        setError(err.message || 'World ID verification failed')
        onError(err)
      }}
    >
      {children}
    </WorldIdWidgetComponent>
  )
} 