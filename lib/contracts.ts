import { createPublicClient, http, parseAbi } from 'viem'
import { readContract } from 'viem/actions'
import { mainnet } from 'viem/chains'

// ABI for the Co-Lancers smart contract
export const coLancersAbi = parseAbi([
  // Events
  'event MemberRegistered(address indexed member, string ensName, uint256 timestamp)',
  'event SkillAdded(address indexed member, string skill, uint8 level, uint256 timestamp)',
  'event SkillVerified(address indexed member, string skill, bool verified, uint256 timestamp)',
  'event ProjectCreated(uint256 indexed projectId, address indexed creator, string title, uint256 budget, uint256 timestamp)',
  'event ProjectCompleted(uint256 indexed projectId, address indexed member, uint256 earnings, uint256 timestamp)',
  'event ReputationUpdated(address indexed member, uint256 newScore, uint256 timestamp)',
  'event PaymentDistributed(uint256 indexed projectId, address indexed member, uint256 amount, uint256 timestamp)',

  // State-changing functions
  'function registerMember(string subdomain, string[] skills, uint8[] levels) external',
  'function addSkill(string skill, uint8 level) external',
  'function verifySkill(address member, string skill, bool verified, string proof) external',
  'function createProject(string title, string description, uint256 budget, address[] teamMembers, uint256[] shares) external returns (uint256)',
  'function completeProject(uint256 projectId) external',
  'function distributePayment(uint256 projectId) external',
  'function updateReputation(address member, uint256 score, string review) external',

  // View functions
  'function getMember(address member) external view returns (string subdomain, uint256 reputationScore, uint256 totalEarnings, uint256 completedProjects)',
  'function getSkills(address member) external view returns (string[] skills, uint8[] levels, bool[] verified)',
  'function getProject(uint256 projectId) external view returns (address creator, string title, string description, uint256 budget, bool completed, uint256 timestamp)',
  'function getProjectMembers(uint256 projectId) external view returns (address[] members, uint256[] shares)',
  'function isRegistered(address member) external view returns (bool)',
  'function getReputationScore(address member) external view returns (uint256)',
  'function getTotalEarnings(address member) external view returns (uint256)',
])

// Contract addresses (these would be deployed addresses)
export const CONTRACT_ADDRESSES = {
  coLancers: process.env.NEXT_PUBLIC_CO_LANCERS_CONTRACT || '0x0000000000000000000000000000000000000000',
  reputation: process.env.NEXT_PUBLIC_REPUTATION_CONTRACT || '0x0000000000000000000000000000000000000000',
  payment: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT || '0x0000000000000000000000000000000000000000',
}

// Types for contract interactions
export interface MemberData {
  subdomain: string
  reputationScore: bigint
  totalEarnings: bigint
  completedProjects: bigint
}

export interface SkillData {
  name: string
  level: number
  verified: boolean
}

export interface ProjectData {
  creator: string
  title: string
  description: string
  budget: bigint
  completed: boolean
  timestamp: bigint
}

export interface ProjectMember {
  address: string
  share: bigint
}

// Contract service class
export class ContractService {
  private static instance: ContractService
  private client: any

  private constructor() {
    this.client = createPublicClient({
      chain: mainnet,
      transport: http(),
    })
  }

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService()
    }
    return ContractService.instance
  }

  /**
   * Get member data from the smart contract
   */
  async getMemberData(address: string): Promise<MemberData | null> {
    try {
      const memberData = await readContract(this.client, {
        address: CONTRACT_ADDRESSES.coLancers as `0x${string}`,
        abi: coLancersAbi,
        functionName: 'getMember',
        args: [address as `0x${string}`],
      })
      
      return {
        subdomain: memberData[0],
        reputationScore: memberData[1],
        totalEarnings: memberData[2],
        completedProjects: memberData[3],
      }
    } catch (error) {
      console.error('Failed to get member data:', error)
      return null
    }
  }

  /**
   * Get skills for a member
   */
  async getMemberSkills(address: string): Promise<SkillData[]> {
    try {
      const skillsData = await readContract(this.client, {
        address: CONTRACT_ADDRESSES.coLancers as `0x${string}`,
        abi: coLancersAbi,
        functionName: 'getSkills',
        args: [address as `0x${string}`],
      })
      
      const skills: SkillData[] = []
      for (let i = 0; i < skillsData[0].length; i++) {
        skills.push({
          name: skillsData[0][i],
          level: Number(skillsData[1][i]),
          verified: skillsData[2][i],
        })
      }
      
      return skills
    } catch (error) {
      console.error('Failed to get member skills:', error)
      return []
    }
  }

  /**
   * Check if an address is registered
   */
  async isRegistered(address: string): Promise<boolean> {
    try {
      const result = await readContract(this.client, {
        address: CONTRACT_ADDRESSES.coLancers as `0x${string}`,
        abi: coLancersAbi,
        functionName: 'isRegistered',
        args: [address as `0x${string}`],
      })

      return result
    } catch (error) {
      console.error('Failed to check registration status:', error)
      return false
    }
  }

  /**
   * Get reputation score for a member
   */
  async getReputationScore(address: string): Promise<bigint> {
    try {
      const result = await readContract(this.client, {
        address: CONTRACT_ADDRESSES.coLancers as `0x${string}`,
        abi: coLancersAbi,
        functionName: 'getReputationScore',
        args: [address as `0x${string}`],
      })

      return result
    } catch (error) {
      console.error('Failed to get reputation score:', error)
      return BigInt(0)
    }
  }

  /**
   * Get total earnings for a member
   */
  async getTotalEarnings(address: string): Promise<bigint> {
    try {
      const result = await readContract(this.client, {
        address: CONTRACT_ADDRESSES.coLancers as `0x${string}`,
        abi: coLancersAbi,
        functionName: 'getTotalEarnings',
        args: [address as `0x${string}`],
      })

      return result
    } catch (error) {
      console.error('Failed to get total earnings:', error)
      return BigInt(0)
    }
  }

  /**
   * Mock function to simulate contract interactions
   * In production, these would be actual contract calls
   */
  async mockContractInteraction(action: string, data: any): Promise<any> {
    // Simulate contract interaction delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    switch (action) {
      case 'registerMember':
        return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` }
      case 'addSkill':
        return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` }
      case 'verifySkill':
        return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` }
      case 'createProject':
        return { success: true, projectId: Math.floor(Math.random() * 1000) }
      case 'completeProject':
        return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` }
      default:
        return { success: false, error: 'Unknown action' }
    }
  }
}

// Export singleton instance
export const contractService = ContractService.getInstance() 