# 🔐 Blockchain-Audit-Log-System-Upgraded

A full-stack blockchain-based audit logging system combining traditional database logs with Ethereum smart contracts for immutable, tamper-proof activity tracking.

## ✨ Features

### Dual-Mode Logging

- **MongoDB Backend**: Fast, queryable audit logs with traditional database features
- **Ethereum Smart Contracts**: Immutable, on-chain audit log storage for critical events
- **Hybrid Approach**: Use both for redundancy and flexibility

### Core Capabilities

- ✅ **Blockchain-style hash chaining** (SHA-256 with MongoDB)
- ✅ **Ethereum smart contract integration** (AuditLog contract)
- ✅ **Tamper detection & chain validation**
- ✅ **Real-time analytics dashboard**
- ✅ **Suspicious & high-risk activity detection**
- ✅ **Role-Based Access Control** (Admin, Auditor, User)
- ✅ **Professional PDF audit reports**
- ✅ **MetaMask wallet integration**
- ✅ **Gas-efficient contract design**

## 🏗️ Architecture

### Project Structure

```Blockchain-Audit-Log-System-Upgraded/
├── blockchain/                 # Hardhat smart contracts
│   ├── contracts/
│   │   └── AuditLog.sol       # Main smart contract
│   ├── scripts/
│   │   └── deploy.js          # Deployment script
│   ├── test/
│   │   └── AuditLog.test.js   # Contract tests
│   ├── hardhat.config.js      # Hardhat configuration
│   └── package.json
│
├── backend/                    # Node.js/Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/                   # React.js UI
│   ├── public/
│   ├── src/
│   │   ├── api/               # API client
│   │   ├── components/        # React components
│   │   ├── context/           # Context API
│   │   ├── pages/             # Page components
│   │   ├── styles/            # CSS files
│   │   ├── web3/              # Web3 utilities
│   │   │   ├── Web3Context.js # Wallet state
│   │   │   ├── useAuditLog.js # Contract hook
│   │   │   ├── web3Utils.js   # Helper functions
│   │   │   └── index.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── docs/
├── README.md
└── SETUP_GUIDE.md
```

## 🛠️ Tech Stack

### Smart Contracts

- **Solidity 0.8.19** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Security best practices
- **ethers.js** - Web3 library

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Crypto (SHA-256)** - Hashing

### Frontend

- **React.js** - UI library
- **React Router** - Navigation
- **ethers.js** - Web3 interaction
- **Context API** - State management
- **CSS3** - Styling

## 📋 How It Works

### Traditional (MongoDB) Logs

Each audit log is stored with:

- Index, Log ID, User, Action
- IP Address, Timestamp
- SHA-256 Hash (generated from combined data)
- Previous Hash (for chain linking)

**Hash Generation Formula:**

```SHA256(index + logId + action + user + ip + timestamp + previousHash)
```

### Smart Contract Logs

Stored directly on Ethereum blockchain:

- Message, Sender Address, Timestamp
- Action, User, IP Address
- **Immutable** - Cannot be modified once added
- **Transparent** - Publicly verifiable
- **Permanent** - Recorded forever

### Verification

1. **MongoDB Validation**: Check hash chain integrity
2. **Smart Contract Validation**: Query on-chain logs
3. **Cross-verification**: Compare both sources for discrepancies

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ with npm
- MetaMask browser extension
- Git

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd Blockchain-Audit-Log-System-Upgraded

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install blockchain dependencies
cd ../blockchain
npm install
```

### 2. Setup Environment Variables

**Backend (.env)***

```PORT=5000
MONGODB_URI=mongodb://localhost:27017/audit_logs
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
SMART_CONTRACT_ADDRESS=0x...  # After deployment
```

**Frontend (.env.local)***

```REACT_APP_API_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=0x...  # After deployment
```

**Blockchain (.env)***

```INFURA_API_KEY=your_infura_api_key
PRIVATE_KEY=your_deployer_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. Deploy Smart Contract

```bash
cd blockchain

# Start local Hardhat network
npx hardhat node

# In another terminal, deploy
npx hardhat run scripts/deploy.js --network localhost

# For testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Start Backend

```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### 5. Start Frontend

```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

## 👤 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

## 📊 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/users` - Get all users (admin only)

### Logs

- `POST /add-log` - Add new audit log
- `GET /blocks` - Get all blocks with pagination
- `GET /block/:id` - Get specific block
- `GET /verify` - Verify blockchain integrity

### Health

- `GET /health` - Check API status

## 🔗 Smart Contract Functions

### Read Functions

```javascript
// Get total log count
getLogCount() → uint256

// Retrieve specific log
getLog(uint256 index) → Log

// Get all logs
getAllLogs() → Log[]

// Get logs by range
getLogsByRange(uint256 start, uint256 end) → Log[]

// Get recent logs
getRecentLogs(uint256 limit) → Log[]

// Get logs by user
getLogsByUser(string user) → Log[]

// Verify integrity
verifyIntegrity() → bool
```

### Write Functions

```javascript
// Add detailed log (admin/owner only)
addLog(string message, string action, string user, string ipAddress)

// Add simple log
addSimpleLog(string message)

// Admin management
addAdmin(address newAdmin)
removeAdmin(address admin)
```

### Events

```javascript
event LogAdded(
    uint256 indexed index,
    string message,
    address indexed sender,
    uint256 timestamp,
    string action,
    string user
);

event AdminAdded(address indexed newAdmin);
event AdminRemoved(address indexed removedAdmin);
```

## 🔐 Security Features

### Smart Contract

- ✅ Access control (owner/admin checks)
- ✅ Input validation (non-empty checks)
- ✅ Immutable logs (no deletion/modification)
- ✅ Event logging (all actions emitted)
- ✅ Optimized gas usage

- **Backend**

- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS protection
- ✅ Error handling

-**Frontend**

- ✅ Protected routes
- ✅ Token-based auth
- ✅ MetaMask integration
- ✅ Network validation

## 📈 Performance

- **Query Response**: < 100ms (MongoDB)
- **Contract Interaction**: Variable (depends on network)
- **Report Generation**: < 2 seconds
- **Blockchain Verification**: < 500ms

## 🧪 Testing

### Run Contract Tests

```bash
cd blockchain
npm test
```

### Test Coverage

- Admin management
- Log addition and retrieval
- Range queries and filtering
- Immutability verification
- Event emissions

## 📱 Features Walkthrough

### Dashboard

- Real-time blockchain overview
- Activity statistics
- Risk indicators
- Recent transactions
- Quick actions

### Add Block

- Create new audit logs
- Smart contract deployment
- Transaction status tracking
- Error handling

### Verify Chain

- Validate blockchain integrity
- Check for tampering
- Detailed verification report

### Risk Monitor

- Suspicious activity detection
- High-risk alert system
- Temporal analysis (delta time)
- Automated notifications

### Analytics

- Activity trends
- User statistics
- Risk distribution
- Export reports

### User Management (Admin Only)

- Create/delete users
- Assign roles
- View all users
- Manage permissions

## 🌐 Network Support

### Local Development

- **Hardhat**: EVM-compatible test network
- **Chain ID**: 31337
- **RPC**: <http://localhost:8545>

### Testnets

- **Sepolia**: Chain ID 11155111
- **Goerli**: Chain ID 5

### Mainnet

- **Ethereum**: Chain ID 1

## 🎯 Blockchain Integration Steps

1. **Deploy Contract**

   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

2. **Copy Contract Address**
   - Found in deployment output
   - Saved in `artifacts/deployment.json`

3. **Update Frontend**
   - Add address to `.env.local`
   - Contract initialized on app startup

4. **Connect Wallet**
   - Click wallet button in navbar
   - Approve MetaMask connection
   - Select correct network

5. **Start Logging**
   - Add logs from dashboard
   - Logs stored in both DB and blockchain
   - View on blockchain explorers

## 🔍 Viewing On-Chain Logs

### Using Block Explorers

- **Sepolia**: <https://sepolia.etherscan.io>
- **Contract Address**: [Your deployment address]
- **Search**: Contract address or tx hash

### Using Web3 Tools

```bash
# Using ethers.js in frontend
const logs = await contract.getAllLogs();
console.log(logs);

# Show log count
const count = await contract.getLogCount();
console.log(`Total logs: ${count}`);
```

## 📚 Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **COMPONENTS.md** - Component documentation
- **REQUIREMENTS.md** - Original requirements
- **Solidity** - AuditLog.sol with detailed comments

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## 📄 License

This project is private and maintained by Yudhveer Sharma.

## 👨‍💻 Author

**Yudhveer Sharma***

- Full-stack blockchain developer
- Blockchain audit systems specialist
- Smart contract security expert

## 📞 Contact & Support

For issues, questions, or feature requests:

1. Check existing documentation
2. Review code comments
3. Test in development environment
4. Submit detailed reports

## 🎓 Learning Resources

- [Solidity Docs](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [ethers.js Guide](https://docs.ethers.org/)
- [OpenZeppelin Security](https://docs.openzeppelin.com/)
- [Ethereum Development](https://ethereum.org/en/developers/)

## 🚀 Future Enhancements

- [ ] IPFS integration for log archival
- [ ] Multi-chain support
- [ ] Decentralized verification
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Hardware wallet support
- [ ] Batch operations
- [ ] Log compression

---

**Status**: ✅ Production Ready with Smart Contracts
**Last Updated**: April 2026
**Version**: 2.0 (Blockchain Enhanced)
