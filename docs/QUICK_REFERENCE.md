# ⚡ Quick Reference Guide

Fast lookup for common tasks and commands.

## Installation & Setup

### One-Time Setup

```bash
# Clone repo
git clone <url>
cd Blockchain-Audit-Log-System-Upgraded

# Install all dependencies
cd blockchain && npm install
cd ../frontend && npm install
cd ../backend && npm install
```

## Smart Contract Development

### Compile

```bash
cd blockchain
npm run compile
```

### Test

```bash
cd blockchain
npm test
# Or watch mode
npm test -- --watch
```

### Deploy Locally

```bash
# Terminal 1: Start Hardhat node
cd blockchain
npx hardhat node

# Terminal 2: Deploy
npm run deploy:local

# Get contract address from output
```

### Deploy to Testnet (Sepolia)

```bash
cd blockchain

# 1. Set up .env
INFURA_API_KEY=your_key
PRIVATE_KEY=your_private_key

# 2. Deploy
npm run deploy:sepolia

# 3. Verify on Etherscan
npx hardhat verify --network sepolia 0xContractAddress
```

## Frontend Development

### Start Development Server

```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

### Build for Production

```bash
cd frontend
npm run build
```

### Run Tests

```bash
cd frontend
npm test
```

## Backend Development

### Start Backend Server

```bash
cd backend
npm start
# Runs on http://localhost:5000
```

### Install New Package

```bash
cd backend
npm install <package-name>
```

## Common Tasks

### Connect Wallet

1. Click "Connect Wallet" button in navbar
2. Approve in MetaMask
3. Select correct network
4. Done!

### Add Log to Blockchain

```javascript
import { useAuditLog } from './web3/useAuditLog';

function Component() {
  const { addLog, isLoading, error } = useAuditLog();
  
  const handleClick = async () => {
    try {
      const result = await addLog(
        'Log message',
        'ACTION_TYPE',
        'username',
        '192.168.1.1'
      );
      console.log('Added:', result.txHash);
    } catch (err) {
      console.error('Failed:', err);
    }
  };
  
  return <button onClick={handleClick}>Add Log</button>;
}
```

### Get All Logs from Blockchain

```javascript
import { useAuditLog } from './web3/useAuditLog';

function Component() {
  const { getAllLogs, isLoading } = useAuditLog();
  
  useEffect(() => {
    getAllLogs().then(logs => {
      console.log('Logs:', logs);
    });
  }, []);
}
```

### Check Wallet Connection

```javascript
import { useWeb3 } from './web3';

function Component() {
  const { isConnected, account, connect } = useWeb3();
  
  return (
    <div>
      {isConnected ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </div>
  );
}
```

## Environment Variables

### Frontend (.env.local)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=0x...
```

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/audit_logs
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:3000
SMART_CONTRACT_ADDRESS=0x...
```

### Blockchain (.env)

```env
INFURA_API_KEY=your_api_key
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_api_key
```

## Hardhat Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local node
npx hardhat node

# Run script
npx hardhat run scripts/deploy.js --network localhost

# Clean artifacts
npx hardhat clean

# Get accounts
npx hardhat accounts
```

## Smart Contract Functions

### Read Functions (Free)

```solidity
// Get total logs
uint256 count = contract.getLogCount();

// Get specific log
(uint256 index, string memory message, address sender, uint256 timestamp) = contract.getLog(0);

// Get all logs
contract.getAllLogs();

// Get recent logs
contract.getRecentLogs(10);

// Filter by user
contract.getLogsByUser("username");

// Get range
contract.getLogsByRange(0, 10);

// Check admin
bool isAdmin = contract.isAdmin(0xAddress);

// Verify integrity
bool isValid = contract.verifyIntegrity();
```

 Write Functions (Costs Gas)

```solidity
// Add log (admin only)
contract.addLog("message", "ACTION", "user", "192.168.1.1");

// Add simple log
contract.addSimpleLog("message");

// Add admin (owner only)
contract.addAdmin(0xNewAdminAddress);

// Remove admin (owner only)
contract.removeAdmin(0xAdminAddress);
```

## Debugging

### Check Contract Compilation

```bash
cd blockchain
npm run compile
# Look for errors in output
```

### Test Contract Functions

```bash
cd blockchain
npm test
# Check which tests pass/fail
```

### View Network Status

```bash
# In hardhat node output
# Shows accounts, balances, deployed contracts
```

### Check MetaMask

1. Open DevTools (F12)
2. Check `window.ethereum` exists
3. Look for Web3Provider errors
4. Check network selection

### View Transaction Details

1. Use Etherscan.io (testnet/mainnet)
2. Or check Hardhat node output
3. Search by contract address or tx hash

## Common Errors

| Error | Solution |
|-------|----------|-
| "Provider not found" | Install MetaMask, refresh page |
| "Contract not initialized" | Wait for Web3Context to init |
| "Insufficient balance" | Get test ETH from faucet |
| "Wrong network" | Switch MetaMask to correct network |
| "Transaction failed" | Check gas limit, account balance |
| "Connection refused" | Start Hardhat node or API server |

## File Locations

```Key Files:
- Smart Contract: blockchain/contracts/AuditLog.sol
- Deploy Script: blockchain/scripts/deploy.js
- Tests: blockchain/test/AuditLog.test.js
- Config: blockchain/hardhat.config.js
- Web3 Utils: frontend/src/web3/web3Utils.js
- Contract Hook: frontend/src/web3/useAuditLog.js
- Web3 Context: frontend/src/web3/Web3Context.js
- API Client: frontend/src/api/apiClient.js
- Documentation: README_BLOCKCHAIN.md, docs/
```

## Useful Links

- **Etherscan**: <https://etherscan.io>
- **Sepolia Faucet**: <https://sepolia-faucet.pk910.de>
- **Hardhat Docs**: <https://hardhat.org/docs>
- **ethers.js Docs**: <https://docs.ethers.org>
- **Solidity Docs**: <https://docs.soliditylang.org>
- **MetaMask**: <https://metamask.io>

## Network Configuration

### Local (Hardhat)

```RPC: http://127.0.0.1:8545
Chain ID: 31337
Currency: ETH
```

### Sepolia Testnet

```RPC: https://sepolia.infura.io/v3/YOUR_KEY
Chain ID: 11155111
Explorer: https://sepolia.etherscan.io
Faucet: https://sepolia-faucet.pk910.de
```

### Ethereum Mainnet

```RPC: https://mainnet.infura.io/v3/YOUR_KEY
Chain ID: 1
Explorer: https://etherscan.io
⚠️ Real money! Use test networks first
```

## Performance Tips

1. **Cache logs locally** - Don't fetch repeatedly
2. **Use pagination** - Don't load all logs at once
3. **Batch writes** - Combine multiple adds
4. **Monitor gas** - Check costs on mainnet
5. **Optimize ABI** - Remove unused functions
6. **Use view functions** - They're free

## Security Reminders

- 🔒 Never commit `.env` files
- 🔒 Never share private keys
- 🔒 Use test networks first
- 🔒 Verify contracts on Etherscan
- 🔒 Test thoroughly before mainnet
- 🔒 Start with small amounts
- 🔒 Use hardware wallets for high-value

## Getting Help

1. **Check documentation**: README_BLOCKCHAIN.md
2. **Review examples**: docs/INTEGRATION_GUIDE.md
3. **Read setup guide**: docs/BLOCKCHAIN_SETUP.md
4. **Search code comments**: Solidity + JavaScript
5. **Check test cases**: blockchain/test/AuditLog.test.js
6. **Review error messages**: Check browser console

---

**Keep this handy for quick reference!** ⭐
