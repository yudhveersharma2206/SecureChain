# 🚀 How to Start the System - Complete Guide

This guide walks you through starting the entire Blockchain Audit Log System correctly.

## Prerequisites

### 1. Install MongoDB (Required for backend)

**Windows**:

```bash
# Option A: Using Chocolatey
choco install mongodb

# Option B: Download installer
# Visit: https://www.mongodb.com/try/download/community
# Run the installer and choose "Install MongoDB as a Service"
```

**Start MongoDB**:

```bash
# MongoDB should auto-start if installed as service
# Verify it's running:
mongosh  # Should connect to local instance

# Or start manually with:
mongod --dbpath "C:\data\db"  # Or your data directory
```

### 2. Install Node.js

- Download from <https://nodejs.org> (v16 or higher)
- Verify: `node --version` and `npm --version`

### 3. Install MetaMask Browser Extension

- Visit: <https://metamask.io>
- Click "Install now" and follow browser prompts

## Step-by-Step Startup

### Step 1: Verify Prerequisites ✅

```bash
# Check MongoDB is running
mongosh
# Should connect. Type: exit

# Check Node.js
node --version
# Should show v16+

npm --version
# Should show 8+

# Check in browser
# MetaMask should be visible as extension icon
```

### Step 2: Install Dependencies

```bash
# Terminal 1: Install backend dependencies
cd backend
npm install

# Terminal 2: Install frontend dependencies
cd frontend
npm install

# Terminal 3: Install blockchain dependencies (optional for now)
cd blockchain
npm install
```

### Step 3: Start Backend (Terminal 1)

```bash
cd backend
npm start

# Expected output:
# 🚀 Server running on port 5000
# ✅ MongoDB Connected: 127.0.0.1
```

**If you see errors:**

- ❌ "Cannot find module": Run `npm install` again
- ❌ "MongoDB Connection Error": Start MongoDB (see above)
- ❌ "Port 5000 in use": Change PORT in .env or kill process using port 5000

### Step 4: Start Frontend (Terminal 2)

```bash
cd frontend
npm start

# Expected output:
# Compiled successfully!
# You can now view blockchain-audit-log in the browser.
# Local:   http://localhost:3000
```

**If you see errors:**

- ❌ "Port 3000 in use": Kill process or change port
- ❌ "Cannot find module 'ethers'": Run `npm install ethers` again
- ❌ "Web3Provider not found": Check imports in App.js

### Step 5: Access Application

1. Open browser to **<http://localhost:3000>**
2. You should see login page
3. Login with:
   - Username: `admin`
   - Password: `admin123`

### Step 6: Connect Wallet (Optional for now)

1. Click **"Connect Wallet"** button in navbar
2. MetaMask should pop up
3. Click **"Approve"**
4. Wallet is now connected!

## Troubleshooting

### MongoDB Issues

**Error: "MongoDB Connection Error"***

```bash
# Check if MongoDB is running
mongosh

# If fails, start MongoDB:

# Windows (if installed as service):
net start MongoDB

# Or manually:
mongod --dbpath "C:\data\db"

# Create data directory if needed:
mkdir C:\data\db
```

**Error: "Connection refused on localhost:27017"**

```bash
# MongoDB is not running. Start it:
mongod --dbpath "C:\data\db"

# Wait 2-3 seconds for it to start fully
# Then try backend again
```

### Backend Issues

**Error: "Port 5000 already in use"***

```bash
# Find and kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env:
PORT=5001
```

**Error: "Cannot find module"***

```bash
cd backend
npm install
npm start
```

### Frontend Issues

**Error: "Port 3000 already in use"***

```bash
# Kill process or change port:
PORT=3001 npm start
```

**Error: "Failed to compile"***

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

**Error: "ethers is not defined"***

```bash
cd frontend
npm install ethers ethers@6.7.1
npm start
```

**Error: "Web3Provider is not exported"***

- Check `frontend/src/web3/Web3Context.js` exists
- Check `frontend/src/web3/index.js` has proper exports
- Check `frontend/src/App.js` imports Web3Provider correctly

### Common Error Solutions

| Error | Solution |
|-------|----------|-
| Cannot connect to localhost:3000 | Frontend not started, run `npm start` in frontend |
| Cannot connect to localhost:5000 | Backend not started, run `npm start` in backend |
| 404 on API calls | Backend not running or port wrong |
| White screen in browser | Check browser console (F12) for errors |
| MetaMask not visible | Install extension: <https://metamask.io> |
| Wallet won't connect | Check if running on localhost with MetaMask installed |
| Login fails | Default: admin/admin123. Check backend is running |
| Logs don't appear | Check dashboard loads, scroll down to see logs |

## Startup Summary

**Quick Reference:**

```bash
# Terminal 1: Backend
cd backend && npm start
# Expected: "🚀 Server running on port 5000"

# Terminal 2: Frontend  
cd frontend && npm start
# Expected: "Compiled successfully!"

# Terminal 3: Optional - MongoDB check
mongosh
# Should connect to local MongoDB
```

## Verifying System Health

### Backend Health Check

```bash
# In terminal, curl:
curl http://localhost:5000/health

# Expected response:
# {"status":"ok","timestamp":"2026-04-02T..."}
```

### Frontend Verification

```bash
# Check in browser DevTools (F12):
# 1. Go to Console tab
# 2. Should be no red errors
# 3. Login should work
# 4. Dashboard should show lots of stats
```

### Database Health Check

```bash
mongosh
> show dbs
> use audit_logs
> db.logs.findOne()
# Should show some data or empty collection
```

## First Time Setup

### Initial Account Creation

After logging in with default credentials (admin/admin123), you can create more users:

1. Go to **Users** (if admin)
2. Click **Create User**
3. Enter: username, password, role
4. Select role: admin, auditor, or viewer
5. Click Save

### Add First Log

1. Go to **Dashboard**
2. Click **Add Block** (if admin)
3. Enter action and user info
4. Click **Add to Database**
5. Log should appear in Recent Blocks table

### Test Smart Contract (Optional)

1. Connect wallet (navbar button)
2. Add log again with wallet connected
3. Approve MetaMask transaction
4. Wait for confirmation (~10-30 seconds)
5. Check transaction status in UI

## Development Workflow

### Day-to-Day Startup

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm start

# Done! Access http://localhost:3000
```

### If System Won't Start

**Step-by-step recovery:**

```bash
# 1. Check MongoDB
mongosh
# If fails: install/start MongoDB

# 2. Check ports are free
netstat -ano | findstr :5000
netstat -ano | findstr :3000
# If in use: kill or change port

# 3. Check dependencies
cd backend && npm install
cd ../frontend && npm install

# 4. Clear cache and restart
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start

# If still failing: Check error messages carefully
```

## Environment Files Verification

### backend/.env

```env
MONGO_URI=mongodb://127.0.0.1:27017/auditlogs_v2
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
CORS_ORIGIN=http://localhost:3000
```

### frontend/.env.local

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=0xDDD96c34dB162eb14F1C61CB2B66d7E19d28f17A
```

If either is wrong or missing, the system won't work!

## Advanced: Blockchain Setup (Optional)

Only do this after the main system is working:

```bash
# Start Hardhat local network
cd blockchain
npx hardhat node
# Wait for accounts to display

# In another terminal: Deploy
npm run deploy:local
# Copy the contract address

# Update frontend/.env.local with contract address
# Restart frontend
```

## Getting Help

1. **Check this guide** - Most issues covered above
2. **Check terminal output** - Error messages are helpful
3. **Check browser console** - F12 → Console tab
4. **Verify prerequisites** - Node, NPM, MongoDB all installed
5. **Check ports** - 3000, 5000, 27017 all free

## Performance Tips

- Keep MongoDB running in background
- Don't close terminal windows (keeps server running)
- Use separate terminals for backend and frontend
- Check browser console for real-time errors
- Network tab (DevTools) shows API calls

## What's Next?

Once fully running:

1. ✅ Test database logging
2. ✅ Test risk monitoring
3. ✅ Test PDF reports
4. ✅ Test wallet connection
5. ✅ Deploy smart contract (optional)
6. ✅ Add logs to blockchain

---

**System is now ready to use! 🎉***
