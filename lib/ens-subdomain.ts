import { createPublicClient, http, parseAbi, createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

// ENS Registry ABI (simplified for subdomain operations)
const ENS_REGISTRY_ABI = parseAbi([
  'function setSubnodeRecord(bytes32 parentNode, string label, address owner, address resolver, uint64 ttl) external',
  'function setSubnodeOwner(bytes32 parentNode, string label, address owner) external returns (bytes32)',
  'function owner(bytes32 node) external view returns (address)',
  'function resolver(bytes32 node) external view returns (address)',
  'function ttl(bytes32 node) external view returns (uint64)',
])

// ENS Resolver ABI (for setting records)
const ENS_RESOLVER_ABI = parseAbi([
  'function setAddr(bytes32 node, address addr) external',
  'function setText(bytes32 node, string key, string value) external',
  'function addr(bytes32 node) external view returns (address)',
  'function text(bytes32 node, string key) external view returns (string)',
])

// ENS Namehash function
function namehash(name: string): string {
  const labels = name.split('.')
  let node = '0x0000000000000000000000000000000000000000000000000000000000000000'
  
  for (let i = labels.length - 1; i >= 0; i--) {
    const labelHash = keccak256(labels[i].toLowerCase())
    node = keccak256(node + labelHash.slice(2))
  }
  
  return node
}

// Simple keccak256 implementation (in production, use a proper crypto library)
function keccak256(str: string): string {
  // This is a simplified implementation
  // In production, use a proper keccak256 implementation
  return '0x' + Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
}

export interface SubdomainData {
  subdomain: string
  fullDomain: string
  owner: string
  resolver: string
  ttl: number
  records: {
    address?: string
    avatar?: string
    description?: string
    url?: string
  }
}

export class ENSSubdomainService {
  private client
  private walletClient
  private parentDomain = 'co-lancers.eth'
  private parentNode: string
  private domain: string

  constructor() {
    this.client = createPublicClient({
      chain: mainnet,
      transport: http(),
    })
    
    this.parentNode = namehash(this.parentDomain)
    this.domain = process.env.NEXT_PUBLIC_CO_LANCERS_DOMAIN || 'colancer.eth'
  }

  /**
   * Generate a unique subdomain based on World ID proof and wallet address
   */
  generateUniqueSubdomain(walletAddress: string, worldIdProof: any): string {
    if (!walletAddress || !worldIdProof) {
      throw new Error('Wallet address and World ID proof are required')
    }

    // Create a unique identifier from World ID proof and wallet address
    const uniqueId = `${walletAddress.slice(2, 8)}${worldIdProof.merkle_root.slice(2, 8)}`
    return `user${uniqueId}`
  }

  /**
   * Check if a subdomain is available under colancer.eth
   */
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    try {
      // Validate subdomain format
      if (!this.isValidSubdomain(subdomain)) {
        return false
      }

      // In a real implementation, you would check against the ENS registry
      // For now, we'll simulate the check
      const fullName = `${subdomain}.${this.domain}`
      
      // Simulate ENS lookup
      const isTaken = await this.checkENSNameExists(fullName)
      return !isTaken
    } catch (error) {
      console.error('Error checking subdomain availability:', error)
      return false
    }
  }

  /**
   * Check if an ENS name exists
   */
  private async checkENSNameExists(name: string): Promise<boolean> {
    // This would be a real ENS lookup
    // For now, we'll simulate with some common names being taken
    const takenNames = [
      'admin.colancer.eth',
      'test.colancer.eth',
      'demo.colancer.eth'
    ]
    
    return takenNames.includes(name)
  }

  /**
   * Get the full ENS name for a subdomain
   */
  getFullENSName(subdomain: string): string {
    return `${subdomain}.${this.domain}`
  }

  /**
   * Validate subdomain format
   */
  isValidSubdomain(subdomain: string): boolean {
    if (!subdomain || subdomain.length < 3 || subdomain.length > 63) {
      return false
    }

    // Only lowercase letters, numbers, and hyphens
    const validFormat = /^[a-z0-9-]+$/.test(subdomain)
    if (!validFormat) {
      return false
    }

    // Cannot start or end with hyphen
    if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
      return false
    }

    // Cannot have consecutive hyphens
    if (subdomain.includes('--')) {
      return false
    }

    return true
  }

  /**
   * Get suggested subdomains based on user input
   */
  getSuggestedSubdomains(userName: string): string[] {
    if (!userName) {
      return ['freelancer', 'developer', 'designer', 'consultant']
    }

    const cleanName = userName.toLowerCase().replace(/[^a-z0-9]/g, '')
    const suggestions = [
      cleanName,
      `${cleanName}dev`,
      `${cleanName}pro`,
      `${cleanName}2024`,
      `${cleanName}work`
    ]

    return suggestions.filter(s => s.length >= 3 && s.length <= 63)
  }

  /**
   * Register a subdomain for a freelancer with World ID verification
   */
  async registerSubdomainWithWorldId(
    subdomain: string, 
    ownerAddress: string,
    worldIdProof: any,
    records?: {
      address?: string
      avatar?: string
      description?: string
      url?: string
    }
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      // Validate World ID proof
      if (!worldIdProof || !worldIdProof.merkle_root) {
        return { success: false, error: 'Invalid World ID proof' }
      }

      // Validate subdomain format
      if (!this.isValidSubdomain(subdomain)) {
        return { success: false, error: 'Invalid subdomain format' }
      }

      // Check availability
      const isAvailable = await this.isSubdomainAvailable(subdomain)
      if (!isAvailable) {
        return { success: false, error: 'Subdomain already taken' }
      }

      // In a real implementation, you would:
      // 1. Verify the World ID proof on-chain
      // 2. Create the subdomain record on ENS
      // 3. Set the resolver
      // 4. Set the address record
      // 5. Set additional records (avatar, description, etc.)
      // 6. Store the World ID verification data

      // For now, we'll simulate the transaction
      const txHash = `0x${Math.random().toString(16).slice(2)}`
      
      console.log('Registering subdomain with World ID:', {
        subdomain,
        fullName: this.getFullENSName(subdomain),
        ownerAddress,
        worldIdProof: worldIdProof.merkle_root,
        records
      })
      
      return { success: true, txHash }
    } catch (error) {
      console.error('Error registering subdomain with World ID:', error)
      return { success: false, error: 'Failed to register subdomain' }
    }
  }

  /**
   * Register a subdomain for a freelancer (legacy method)
   */
  async registerSubdomain(
    subdomain: string, 
    ownerAddress: string, 
    records?: {
      address?: string
      avatar?: string
      description?: string
      url?: string
    }
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      // Validate subdomain format
      if (!this.isValidSubdomain(subdomain)) {
        return { success: false, error: 'Invalid subdomain format' }
      }

      // Check availability
      const isAvailable = await this.isSubdomainAvailable(subdomain)
      if (!isAvailable) {
        return { success: false, error: 'Subdomain already taken' }
      }

      // In a real implementation, you would:
      // 1. Create the subdomain record
      // 2. Set the resolver
      // 3. Set the address record
      // 4. Set additional records (avatar, description, etc.)

      // For now, we'll simulate the transaction
      const txHash = `0x${Math.random().toString(16).slice(2)}`
      
      return { success: true, txHash }
    } catch (error) {
      console.error('Error registering subdomain:', error)
      return { success: false, error: 'Failed to register subdomain' }
    }
  }

  /**
   * Get subdomain information
   */
  async getSubdomainInfo(subdomain: string): Promise<{
    owner?: string
    address?: string
    avatar?: string
    description?: string
    url?: string
  } | null> {
    try {
      const fullName = this.getFullENSName(subdomain)
      
      // In a real implementation, you would query the ENS registry
      // For now, we'll return mock data
      return {
        owner: '0x1234567890123456789012345678901234567890',
        address: '0x1234567890123456789012345678901234567890',
        avatar: '',
        description: 'Co-Lancers freelancer',
        url: ''
      }
    } catch (error) {
      console.error('Error getting subdomain info:', error)
      return null
    }
  }

  /**
   * Update subdomain records
   */
  async updateSubdomainRecords(
    subdomain: string,
    records: {
      address?: string
      avatar?: string
      description?: string
      url?: string
    }
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const fullDomain = `${subdomain}.${this.parentDomain}`
      const node = namehash(fullDomain)
      
      // In a real implementation, you would update the resolver records
      // For now, we'll simulate the transaction
      const txHash = `0x${Math.random().toString(16).slice(2)}`
      
      return { success: true, txHash }
    } catch (error) {
      console.error('Error updating subdomain records:', error)
      return { success: false, error: 'Failed to update records' }
    }
  }
}

// Export singleton instance
export const ensSubdomainService = new ENSSubdomainService() 