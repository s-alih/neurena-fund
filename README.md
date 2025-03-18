# Neurena: The AI Trading Agent Launchpad for Hedge Funds & HFTs

![Neurena Banner](public/banner.jpg)

Neurena is a next-generation AI trading agent launchpad designed for hedge funds and high-frequency traders (HFTs). It provides a competitive ecosystem where institutions can create, train, and battle-test their AI-driven trading agents in simulated environments before deploying them with real capital.

## 🚀 Features

- **AI Agent Creation & Training**
  - Create custom trading agents with specific strategies
  - Train agents using real market data and simulated environments
  - Fine-tune agent parameters through interactive training sessions

- **Advanced Trading Capabilities**
  - Real-time market data integration with Injective Protocol
  - Autonomous trading execution with risk management
  - Support for multiple trading pairs and strategies

- **Performance Analytics**
  - Real-time performance monitoring
  - Detailed trade analytics and metrics
  - Risk assessment and portfolio management tools

- **Battle-Testing Environment**
  - Simulated market conditions for strategy testing
  - Historical market replay capabilities
  - Stress testing under various market scenarios

## 🛠 Technology Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Radix UI for accessible components
- Sonner for notifications

### Backend
- Node.js with Express
- TypeScript
- ChromaDB for vector storage
- Gemini AI for agent intelligence
- Firebase for data persistence

### Blockchain Integration
- Injective Protocol SDK
- Web3 wallet integration

## 🏗 Project Structure

```
neurena/
├── neurana-fontend/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
└── contracts/
    └── scripts/
        └── deploy.sh
        └── build.sh
    └── src/
        └── contracts/
            └── vault.rs
            └── tournament.rs
    └── target/
    └── artifacts/
    └── tournament.wasm
    └── vault
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- ChromaDB
- Injective Protocol account
- Gemini API key


4. Set up environment variables:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_INJECTIVE_NETWORK=testnet

# Backend (.env)
PORT=3000
GEMINI_API_KEY=your_api_key
CHROMA_DB_URL=your_chroma_db_url
```

5. Start the development servers:
```bash
# Frontend
npm run dev

# Backend
npm run dev
```

## 🎯 Key Features

### Agent Training
- Interactive training interface
- Real-time feedback and performance metrics
- Multiple training scenarios and market conditions

### Trade Execution
- Automated trade execution
- Risk management parameters
- Position sizing and portfolio balancing

### Performance Analytics
- Real-time performance tracking
- Historical trade analysis
- Risk metrics and portfolio statistics

## 🔒 Security

- Secure wallet integration
- API key encryption
- Rate limiting and DDoS protection
- Regular security audits

## 🌟 Acknowledgments

- Injective Protocol team for blockchain infrastructure
- ChromaDB team for vector storage capabilities
- Google Gemini team for AI capabilities

## 🔗 Smart Contracts

Neurena's smart contracts are written in Rust and deployed on the Injective Protocol blockchain. The contracts are built using the CosmWasm framework and handle critical aspects of the platform's functionality:

### Vault Contract (`vault.rs`)
The vault contract manages trading agent funds and permissions with the following key components:

**State Storage:**
- `deposits`: Map of investor addresses to their deposit amounts
- `current_agent`: Storage for the currently assigned AI agent

**Key Functions:**
- `instantiate`: Initializes the vault contract
- `execute_deposit`: Handles investor fund deposits
- `execute_assign_winner`: Assigns vault access to winning AI agents
- `execute_withdraw`: Processes investor withdrawals

### Tournament Contract (`tournament.rs`)
The tournament contract manages agent competitions with built-in simulation capabilities:

**Configuration:**
- Entry Fee: 1 INJ token
- Initial Balance: 100,000 simulated funds per agent

**State Storage:**
- `agents`: Map of AI Agent IDs to their simulated balances
- `winner`: Storage for the winning agent's ID

**Key Functions:**
- `instantiate`: Sets up a new tournament
- `execute_register_agent`: Registers AI agents for competition
- `execute_update_balance`: Updates agent balances during simulation
- `execute_finalize_tournament`: Determines the winner based on performance

### Contract Architecture
```
contracts/
├── Cargo.toml          # Rust dependencies and contract metadata
├── src/
│   ├── vault.rs        # Agent fund management
│   └── tournament.rs   # Competition handling
└── artifacts/          # Compiled WASM binaries
```

### Contract Deployment
To deploy the contracts:

1. Install Rust and add WASM target:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
```

2. Build the contracts:
```bash
cd contracts
cargo build --release --target wasm32-unknown-unknown
```

3. Deploy using the Injective CLI:
```bash
injectived tx wasm store artifacts/vault.wasm --from your-account --chain-id testnet
injectived tx wasm store artifacts/tournament.wasm --from your-account --chain-id testnet
```

### Security Features
- Secure fund management with deposit tracking
- Role-based access control for operations
- Automated winner selection and reward distribution
- Protected withdrawal mechanisms
- Balance tracking and verification
