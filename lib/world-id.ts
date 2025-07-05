export interface WorldIdProof {
  merkle_root: string
  nullifier_hash: string
  proof: string
  credential_type: string
  action: string
  signal: string
}

export class WorldIdService {
  private appId: string

  constructor() {
    this.appId = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || 'app_staging_your_app_id'
  }

  /**
   * Verify a World ID proof
   */
  async verifyProof(proof: WorldIdProof): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real implementation, you would verify the proof on-chain
      // For now, we'll simulate the verification
      
      if (!proof.merkle_root || !proof.nullifier_hash || !proof.proof) {
        return { success: false, error: 'Invalid proof format' }
      }

      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check if this nullifier has been used before
      const isUsed = await this.checkNullifierUsed(proof.nullifier_hash)
      if (isUsed) {
        return { success: false, error: 'Proof already used' }
      }

      return { success: true }
    } catch (error) {
      console.error('Error verifying World ID proof:', error)
      return { success: false, error: 'Verification failed' }
    }
  }

  /**
   * Check if a nullifier has been used before
   */
  private async checkNullifierUsed(nullifierHash: string): Promise<boolean> {
    // In a real implementation, you would check against your database or smart contract
    // For now, we'll simulate by storing used nullifiers in localStorage
    if (typeof window === 'undefined') {
      return false // Server-side, assume not used
    }
    const usedNullifiers = JSON.parse(localStorage.getItem('used_nullifiers') || '[]')
    return usedNullifiers.includes(nullifierHash)
  }

  /**
   * Mark a nullifier as used
   */
  async markNullifierUsed(nullifierHash: string): Promise<void> {
    if (typeof window === 'undefined') {
      return // Server-side, skip localStorage operations
    }
    const usedNullifiers = JSON.parse(localStorage.getItem('used_nullifiers') || '[]')
    usedNullifiers.push(nullifierHash)
    localStorage.setItem('used_nullifiers', JSON.stringify(usedNullifiers))
  }

  /**
   * Get the app ID for World ID widget
   */
  getAppId(): string {
    return this.appId
  }

  /**
   * Generate a unique signal for World ID verification
   */
  generateSignal(walletAddress: string): string {
    return `register_${walletAddress.toLowerCase()}`
  }

  /**
   * Validate World ID proof format
   */
  validateProof(proof: any): proof is WorldIdProof {
    return (
      proof &&
      typeof proof.merkle_root === 'string' &&
      typeof proof.nullifier_hash === 'string' &&
      typeof proof.proof === 'string' &&
      typeof proof.credential_type === 'string' &&
      typeof proof.action === 'string' &&
      typeof proof.signal === 'string'
    )
  }
}

export const worldIdService = new WorldIdService() 