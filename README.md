# Election Voting DApp

A decentralized voting application built on Conflux Network that allows users to create and participate in elections with secure and transparent voting mechanisms.

## Features

- Create and manage elections
- Add candidates with descriptions
- Whitelist-based voting system
- Real-time election results
- Secure voting mechanism
- Candidate information display
- Election status tracking
- Responsive UI design

## Tech Stack

- **Frontend**: 
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - ethers.js

- **Smart Contract**:
  - Solidity
  - Conflux Network

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Conflux Portal or compatible Web3 wallet

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ElectionVotingDapp-CFX.git
cd ElectionVotingDapp-CFX
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd Frontend
npm install

# Install smart contract dependencies
cd ../SmartContract
npm install
```

3. Configure environment variables:
Create a `.env` file in the Frontend directory with the following variables:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_NETWORK_ID=your_network_id
```

## Running the Application

1. Start the frontend development server:
```bash
cd Frontend
npm run dev
```

2. Deploy the smart contract:
```bash
cd SmartContract
npx hardhat run scripts/deploy.js --network conflux
```

## Smart Contract Features

- Election creation and management
- Candidate registration
- Whitelist management
- Secure voting mechanism
- Results calculation
- Access control

## Frontend Features

- Modern and responsive UI
- Real-time election status updates
- Candidate information display
- Voting interface
- Results visualization
- Whitelist management interface

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Conflux Network for the blockchain infrastructure
- Next.js team for the amazing framework
- Shadcn UI for the beautiful components
- All contributors who have helped in the development

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/ElectionVotingDapp-CFX 