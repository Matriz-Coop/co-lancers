# CoLancers dApp

A decentralized application that allows freelancers to join collaborative service teams, get paid fairly, and build verified reputation using ENS names, World ID verification, and Flare's FDC for skill verification.

## Features

### 🆔 **ENS Identity Management**
- Use a primary ENS name for the company, and, upon registration every user has to set up a secondary name, with an avatar (not mandatory)
- All skills, projects, and reputation tied to ENS domains
- Decentralized identity verification

### 🌍 **World ID Integration**
- Unique human verification to prevent duplicate registrations
- One person, one account policy
- Privacy-preserving identity verification

### ⭐ **Skill Verification with Flare FDC**
- Verify skills through Flare's Flare Data Connector (FDC)
- On-chain credential verification
- Cross-referencing with multiple data sources

### 💰 **Fair Payment System**
- Smart contract-based payment distribution
- Transparent compensation based on contribution
- Automated payment processing

### 📊 **Reputation System**
- Verifiable reputation through client reviews
- Skill endorsements and certifications
- On-chain reputation tracking

### 👥 **Collaborative Teams**
- Join and manage team projects
- Track team performance and contributions
- Collaborative skill development

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, Viem
- **Wallet Connection**: RainbowKit
- **Identity**: ENS, World ID
- **Verification**: Flare FDC
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ 
- pnpm
- MetaMask or other Web3 wallet
- ENS name (optional but recommended)
- World ID app (for production)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd co-lancers
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # WalletConnect Project ID (get from https://cloud.walletconnect.com/)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

   # World ID App ID (get from https://developer.worldcoin.org/)
   NEXT_PUBLIC_WORLD_ID_APP_ID=app_staging_your_app_id

   # Contract addresses (deploy your own or use testnet addresses)
   NEXT_PUBLIC_CO_LANCERS_CONTRACT=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_REPUTATION_CONTRACT=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_PAYMENT_CONTRACT=0x0000000000000000000000000000000000000000

   # Flare FDC API (for production)
   NEXT_PUBLIC_FLARE_FDC_URL=https://api.flare.network/fdc
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Registration Process

1. **Connect Wallet**: Use RainbowKit to connect your Web3 wallet
2. **World ID Verification**: Complete World ID verification for unique human identity and prevent duplicate registrations
3. **ENS Name Generation**: A unique ENS subdomain is automatically generated under `colancer.eth` based on your World ID verification
4. **Add Skills**: Add your skills with proficiency levels
5. **Complete Registration**: Submit your profile to join the platform

### Dashboard Features

- **Overview**: View recent activity, earnings, and project status
- **Skills Management**: Add, edit, and verify skills with Flare FDC
- **Project Tracking**: Monitor active and completed projects
- **Reputation System**: View reviews, ratings, and reputation score

### Skill Verification

Skills can be verified through multiple methods:
- **GitHub Activity**: For development skills
- **On-chain Activity**: For blockchain-related skills
- **Portfolio Verification**: For design and creative skills
- **Certification Verification**: For formal certifications

## Smart Contracts

The dApp uses several smart contracts for:
- **Member Registration**: ENS and World ID verification
- **Skill Management**: Add and verify skills
- **Project Management**: Create and complete projects
- **Payment Distribution**: Fair payment distribution
- **Reputation System**: On-chain reputation tracking

### Contract Functions

```solidity
// Member registration
function registerMember(string ensName, string[] skills, uint8[] levels) external

// Skill management
function addSkill(string skill, uint8 level) external
function verifySkill(address member, string skill, bool verified, string proof) external

// Project management
function createProject(string title, string description, uint256 budget, address[] teamMembers, uint256[] shares) external returns (uint256)
function completeProject(uint256 projectId) external

// Payment and reputation
function distributePayment(uint256 projectId) external
function updateReputation(address member, uint256 score, string review) external
```

## API Integration

### Flare FDC Integration

The dApp integrates with Flare's Flare Data Connector for skill verification:

```typescript
// Verify a skill
const result = await flareFDCService.verifySkill({
  skillName: 'React',
  skillLevel: 'advanced',
  walletAddress: '0x...',
  ensName: 'yourname.eth'
})
```

### World ID Integration

World ID is used for unique human verification:

```typescript
// World ID verification
<IDKitWidget
  app_id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID}
  action="register"
  signal="user_value"
  onSuccess={handleWorldIdSuccess}
>
  {({ open }) => <button onClick={open}>Verify with World ID</button>}
</IDKitWidget>
```

## Development

### Project Structure

```
co-lancers/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── register/          # Registration page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Web3 providers
├── components/            # Reusable components
├── lib/                   # Utilities and services
│   ├── contracts.ts      # Smart contract interactions
│   └── flare-fdc.ts     # Flare FDC integration
├── public/               # Static assets
└── package.json          # Dependencies
```

### Available Scripts

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type checking
pnpm type-check
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Deploy the `out` directory to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@co-lancers.com

## Roadmap

- [ ] Smart contract deployment and testing
- [ ] Integration with actual Flare FDC APIs
- [ ] Mobile app development
- [ ] Advanced reputation algorithms
- [ ] Multi-chain support
- [ ] DAO governance integration
- [ ] Advanced team management features
- [ ] AI-powered skill matching

---

Built with ❤️ for the future of collaborative freelancing
