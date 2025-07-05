import { worldIdService, WorldIdProof } from './world-id'
import { ensSubdomainService } from './ens-subdomain'

export async function testWorldIdAndENSIntegration() {
  console.log('🧪 Testing World ID and ENS Integration...')

  // Test 1: World ID Service
  console.log('\n1. Testing World ID Service...')
  
  const mockProof: WorldIdProof = {
    merkle_root: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    nullifier_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    proof: '0xproof1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    credential_type: 'orb',
    action: 'register',
    signal: 'register_0x1234567890123456789012345678901234567890'
  }

  // Test proof validation
  const isValidProof = worldIdService.validateProof(mockProof)
  console.log('✅ Proof validation:', isValidProof)

  // Test signal generation
  const testAddress = '0x1234567890123456789012345678901234567890'
  const signal = worldIdService.generateSignal(testAddress)
  console.log('✅ Signal generation:', signal)

  // Test 2: ENS Subdomain Service
  console.log('\n2. Testing ENS Subdomain Service...')
  
  // Test subdomain generation
  const generatedSubdomain = ensSubdomainService.generateUniqueSubdomain(testAddress, mockProof)
  console.log('✅ Generated subdomain:', generatedSubdomain)

  // Test subdomain validation
  const isValidSubdomain = ensSubdomainService.isValidSubdomain(generatedSubdomain)
  console.log('✅ Subdomain validation:', isValidSubdomain)

  // Test full ENS name generation
  const fullENSName = ensSubdomainService.getFullENSName(generatedSubdomain)
  console.log('✅ Full ENS name:', fullENSName)

  // Test 3: Integration Test
  console.log('\n3. Testing Integration...')
  
  try {
    // Simulate the registration flow
    const registrationResult = await ensSubdomainService.registerSubdomainWithWorldId(
      generatedSubdomain,
      testAddress,
      mockProof,
      {
        description: 'Test Co-Lancers freelancer',
        url: `https://colancer.eth/profile/${generatedSubdomain}`
      }
    )
    
    console.log('✅ Registration result:', registrationResult)
    
    if (registrationResult.success) {
      console.log('🎉 Integration test passed!')
      return true
    } else {
      console.log('❌ Registration failed:', registrationResult.error)
      return false
    }
  } catch (error) {
    console.error('❌ Integration test failed:', error)
    return false
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).testWorldIdAndENSIntegration = testWorldIdAndENSIntegration
} else {
  // Node.js environment
  testWorldIdAndENSIntegration().then(success => {
    console.log('Test completed:', success ? 'PASSED' : 'FAILED')
    process.exit(success ? 0 : 1)
  })
} 