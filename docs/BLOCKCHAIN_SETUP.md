# 🔗 Blockchain Setup Guide

Complete step-by-step guide to deploy and integrate the AuditLog smart contract.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Smart Contract Development](#smart-contract-development)
3. [Local Deployment](#local-deployment)
4. [Testnet Deployment](#testnet-deployment)
5. [Frontend Integration](#frontend-integration)
6. [Verification & Testing](#verification--testing)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js** 16+ with npm
- **Git**
- **MetaMask** browser extension (for testnet/mainnet)

### Accounts & APIs

- **MetaMask Wallet** (create at <https://metamask.io>)
- **Infura Account** (free tier at <https://infura.io>)
- **Etherscan Account** (free at <https://etherscan.io>)

### Knowledge

- Basic Solidity/JavaScript
- Understanding of gas, transactions
- Ethereum network basics

## Smart Contract Development

### 1. Hardhat Setup

Hardhat is already configured in the `blockchain/` folder.

**File Structure**:

```blockchain/
├── contracts/
│   └── AuditLog.sol          # Smart contract
├── scripts/
│   └── deploy.js             # Deployment script
├── test/
│   └── AuditLog.test.js      # Contract tests
├── artifacts/                # Compiled contracts (auto-generated)
├── hardhat.config.js         # Hardhat configuration
└── package.json
```

### 2. Contract Overview

**AuditLog.sol** - Main smart contract with:

#### State Variables

```solidity
Log[] public logs;           // All audit logs
address public owner;        // Contract owner
mapping(address => bool) public admins;  // Admin addresses
uint256 public nextLogIndex; // Log counter
```

#### Key Functions

**Admin Only**:

- `addLog()` - Add detailed log entry
- `addSimpleLog()` - Add simple message
- `addAdmin()` - Grant admin role (owner only)
- `removeAdmin()` - Revoke admin role (owner only)

**Public**:

- `getAllLogs()` - Retrieve all logs
- `getLog(index)` - Get specific log
- `getLogCount()` - Total log count
- `getLogsByRange()` - Paginated retrieval
- `getRecentLogs()` - Latest logs
- `getLogsByUser()` - Filter by user
- `verifyIntegrity()` - Check immutability

#### Events

```solidity
event LogAdded(uint256 indexed index, string message, ...);
event AdminAdded(address indexed newAdmin);
event AdminRemoved(address indexed removedAdmin);
```

### 3. Compile Contract

```bash
cd blockchain

# Compile contract
npx hardhat compile

# Output:
# 📦 Compiling contracts...
# ✓ Successfully compiled 1 contract
# Artifacts created: ./artifacts
```

**Output Files**:

- `artifacts/contracts/AuditLog.sol/AuditLog.json` - Contract ABI & bytecode
 Used for deployment and frontend interaction

## Local Deployment

Perfect for development and testing.

### Step 1: Start Local Network

```bash
cd blockchain

# Terminal 1: Start Hardhat node
npx hardhat node

# Output:
# Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545
# Accounts (10 available):
# Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
# Account #1: 0x70997970C51812e339D9B73b0245ad59...
# ...
```

This gives you 10 pre-funded test accounts.

### Step 2: Deploy Contract

```bash
# Terminal 2: Deploy
npx hardhat run scripts/deploy.js --network localhost

# Output:
# 🚀 Starting AuditLog smart contract deployment...
# 📝 Deploying contract with account: 0xf39Fd6e...
# 💰 Account balance: 10000000000000000000 wei
# ⏳ Waiting for deployment transaction to be mined...
# ✅ AuditLog contract deployed successfully!
# 📍 Contract address: 0xDDD96c34dB162eb14F1C61CB2B66d7E19d28f17A
# ...
```

### Step 3: Get Contract Address

From deployment output, copy the contract address:

```📍 Contract address: 0xDDD96c34dB162eb14F1C61CB2B66d7E19d28f17A
```

Also saved in: `blockchain/artifacts/deployment.json`

### Step 4: Configure Frontend

Update `frontend/.env.local`:

```REACT_APP_API_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=0xDDD96c34dB162eb14F1C61CB2B66d7E19d28f17A
```

### Step 5: Add Network to MetaMask

1. Open MetaMask
2. Network dropdown → Add Network
3. Configure:
   - **Network Name**: Hardhat Local
   - **New RPC URL**: <http://localhost:8545>
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
4. Click "Save"

### Step 6: Import Test Account

1. MetaMask → Accounts → Import Account
2. Enter private key from hardhat output (Account #0)
3. Name it "Test Account"
4. Done! You have 10,000 ETH for testing

## Testnet Deployment

Deploy to Sepolia testnet (requires real testnet funds).

### Step 1: Get Infura API Key

1. Visit <https://infura.io>
2. Sign up (free)
3. Create new project → Select "Web3 API"
4. Copy API key

### Step 2: Get Private Key

**⚠️ Security**: Never share private keys!

From MetaMask:

1. Account menu → Settings → Security & Privacy
2. Show Private Key
3. Copy (only use test accounts)

### Step 3: Configure Environment

Create `blockchain/.env`:

```env
INFURA_API_KEY=your_infura_api_key_here
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Step 4: Get Sepolia Testnet ETH

Get free test ETH from faucets:

- [Sepolia Faucet](https://sepolia-faucet.pk910.de)
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

Takes ~1 minute per request

### Step 5: Deploy to Testnet

```bash
cd blockchain

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Output:
# 🚀 Starting AuditLog smart contract deployment...
# ⏳ Waiting for deployment transaction to be mined...
# ✅ AuditLog contract deployed successfully!
# 📍 Contract address: 0x... (testnet address)
# 📊 Deployment Details:
#   - Transaction Hash: 0x...
#   - Block: 12345678
```

### Step 6: Verify on Etherscan

Make contract publicly readable:

```bash
npx hardhat verify --network sepolia 0xYourContractAddress

# Output:
# ✓ Verified Successfully
# https://sepolia.etherscan.io/address/0x...
```

### Step 7: Add Sepolia to MetaMask

1. MetaMask → Add Network
2. Configure:
   - **Network Name**: Sepolia Testnet
   - **New RPC URL**: <https://sepolia.infura.io/v3/YOUR_API_KEY>
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH
3. Save

### Step 8: Import Account

Add the same account used for deployment to MetaMask.

### Step 9: Update Frontend

Update `frontend/.env.local`:

```REACT_APP_CONTRACT_ADDRESS=0x... (Sepolia address)
```

## Frontend Integration

### Step 1: Contract ABI Setup

The ABI is automatically imported from:

```artifacts/contracts/AuditLog.sol/AuditLog.json
```

On app initialization:

```javascript
import deploymentConfig from '../path/to/deployment.json';

// In initialization
web3Provider.setupContract(
  process.env.REACT_APP_CONTRACT_ADDRESS,
  deploymentConfig.abi
);
```

### Step 2: useAuditLog Hook

Use in any React component:

```javascript
import { useAuditLog } from './web3/useAuditLog';

function MyComponent() {
  const {
    getAllLogs,
    addLog,
    getLogCount,
    isLoading,
    error,
  } = useAuditLog();

  // Read logs
  const handleFetchLogs = async () => {
    const logs = await getAllLogs();
    console.log(logs);
  };

  // Add log
  const handleAddLog = async () => {
    try {
      const result = await addLog(
        'User performed action',
        'ACTION_TYPE',
        'username',
        '192.168.1.1'
      );
      console.log('Log added to blockchain!', result.txHash);
    } catch (error) {
      console.error('Failed to add log:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFetchLogs} disabled={isLoading}>
        Fetch Logs
      </button>
      <button onClick={handleAddLog} disabled={isLoading}>
        Add Log
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Step 3: Web3Context

Manage wallet state globally:

```javascript
import { useWeb3 } from './web3/Web3Context';

function NavComponent() {
  const { isConnected, account, connect, disconnect } = useWeb3();

  return (
    <div>
      {isConnected ? (
        <div>
          Connected: {account.substring(0, 6)}...
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

## Verification & Testing

### Run Tests

```bash
cd blockchain

# Run all tests
npm test

# Output:
# AuditLog Contract
#   Deployment
#     ✓ Should set the right owner (52ms)
#     ✓ Should have empty logs initially
#   Adding Logs
#     ✓ Should add a simple log (78ms)
#     ✓ Should add a detailed log
#     ✓ Should emit LogAdded event
#   ...
# 11 passing (2s)
```

### Verify Smart Contract Immutability

Check that logs cannot be modified once added:

```javascript
// Before adding log
const log1 = await contract.getLog(0);

// Add another log
await contract.addLog('New log', 'ACTION', 'user', 'ip');

// Verify first log unchanged
const log2 = await contract.getLog(0);
assert(log1.message === log2.message, 'Log was modified!');
```

### Check Gas Usage

View gas consumption for each operation:

```bash
REPORT_GAS=true npx hardhat test
```

**Typical Gas Costs**:

- `addLog()`: ~60,000 - 100,000 gas
- `getLog()`: Free (view function)
- `getAllLogs()`: Free (view function)

### View Deployment Info

```bash
cat blockchain/artifacts/deployment.json
```

Shows:

- Contract address
- Deployer address
- Deployment block
- Transaction hash
- Contract ABI

## Troubleshooting

### MetaMask Connection Issues

**Problem**: "Provider not found"

```Solution: Install MetaMask and refresh page
```

**Problem**: "Wallet not connected"

```Solution:
1. Click wallet button in navbar
2. Approve connection in MetaMask
3. Select correct network
```

### Network Mismatch

**Problem**: "Trying to connect to wrong network"

```Solution:
1. Check REACT_APP_CONTRACT_ADDRESS in .env.local
2. Switch MetaMask to correct network
3. Verify chain ID in deployment config
```

### Gas Issues

**Problem**: "Out of gas" error

```Solution:
1. Increase gas limit in transaction
2. Check account balance (needs ~0.01 ETH)
3. Wait for network congestion to decrease
```

### Contract Not Found

**Problem**: "Contract does not exist at 0x..."

```Solution:
1. Verify contract address is correct
2. Check deployment on correct network
3. Re-deploy if necessary
4. Verify on block explorer
```

### Deployment Fails

**Problem**: "Insufficient balance"

```Solution:
- Local: Restart hardhat node (gets 10,000 ETH)
- Testnet: Get more test ETH from faucet
- Mainnet: Transfer real ETH to account
```

**Problem**: "Nonce too low"

```Solution:
1. Clear MetaMask transaction history
2. Reset account in MetaMask settings
3. Wait for pending transactions to complete
```

### Frontend Errors

**Problem**: "useAuditLog must be used within Web3Provider"

```Solution: Ensure Web3Provider wraps component in App.js
```

**Problem**: "Contract not initialized"

```Solution:
1. Wait for Web3Context to initialize
2. Call setupContract() with address
3. Check browser console for errors
```

## Additional Resources

### Contract Interaction Tools

- **Hardhat Console**: `npx hardhat console`
- **Etherscan**: View contracts and transactions
- **MetaMask**: Interact with contracts directly

### Code Walkthroughs

```javascript
// Read all logs (no gas cost)
const logs = await contract.getAllLogs();

// Add log (costs gas)
const tx = await contract.addLog(
  'message',
  'action',
  'user',
  '192.168.1.1'
);
await tx.wait(); // Wait for confirmation

// Filter logs by user
const userLogs = await contract.getLogsByUser('username');

// Get recent logs with pagination
const recent = await contract.getRecentLogs(10);
```

### Gas Optimization Tips

1. Use `getLogCount()` to check log count first
2. Paginate with `getLogsByRange()` for large datasets
3. Cache logs locally to reduce RPC calls
4. Use filter on client-side when possible
5. Batch transactions when adding multiple logs

### Next Steps

1. ✅ Deploy contract locally
2. ✅ Test with Hardhat
3. ✅ Deploy to Sepolia testnet
4. ✅ Integrate with frontend
5. ✅ Connect MetaMask wallet
6. ✅ Add and verify logs on-chain
7. View on Etherscan block explorer
8. Deploy to mainnet (optional)

---

**Need Help?**

- Check Hardhat docs: <https://hardhat.org/docs>
- Solidity docs: <https://docs.soliditylang.org/>
- ethers.js guide: <https://docs.ethers.org/>
- Ethereum info: <https://ethereum.org/en/developers/>

**Happy Deploying! 🚀***
