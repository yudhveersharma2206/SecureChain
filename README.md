# SecureChain

### Blockchain-Based Audit Monitoring System

SecureChain is a full-stack blockchain-inspired audit logging system designed to provide tamper-proof activity tracking, secure audit storage, and real-time blockchain verification.

The system simulates blockchain architecture using SHA-256 hash chaining, where every audit log is stored as a linked block to ensure integrity and detect unauthorized modifications instantly.

---

# Features

- Blockchain-style hash chaining
- Tamper detection & chain validation
- Real-time analytics dashboard
- Suspicious & high-risk activity detection
- Role-Based Access Control (Admin, Auditor, User)
- Professional PDF audit report generation
- Interactive React-based multi-page UI
- JWT Authentication
- Blockchain verification system
- Scroll animations & modern UI

---

# How It Works

Each audit log is stored as a blockchain-style block containing:

- Index
- Log ID
- User
- Action
- IP Address
- Timestamp
- Previous Hash
- SHA-256 Hash

### Hash Generation

```txt
index + logId + action + user + ip + timestamp + previousHash
```

If any block data is modified:

- Hash changes instantly
- Chain linkage breaks
- Verification fails
- Tampering is detected immediately

---

# 🏗 Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Crypto (SHA-256)
- JWT Authentication

## Frontend
- React.js
- React Router
- Context API
- jsPDF
- CSS3 Animations

## Blockchain
- Solidity
- Hardhat
- Ethers.js
- MetaMask Integration

---

# API Endpoints

## Add Log (Admin Only)

```http
POST /api/log/add
```

## Verify Blockchain

```http
GET /api/log/verify
```

## Get Full Blockchain

```http
GET /api/log/blocks
```

---

# PDF Audit Report

The system generates professional audit reports containing:

- Total blocks
- Blockchain integrity status
- Risk analysis
- Suspicious activity summary
- Full blockchain table
- Generation timestamp

---

#  Installation

## 1️⃣ Clone Repository

```bash
git clone <https://github.com/yudhveersharma2206/SecureChain.git>
cd SecureChain
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

Runs on:

```txt
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Runs on:

```txt
http://localhost:3000
```

---

# Demo Credentials

```txt
Username: admin
Password: admin123
```

---

# Project Structure

```txt
SecureChain/
│
├── backend/
├── frontend/
├── blockchain/
├── docs/
└── README.md
```

---

# Security Features

- SHA-256 Hashing
- JWT Authentication
- Blockchain Integrity Verification
- Role-Based Access Control
- Tamper Detection
- Secure Audit Trails

---

# Future Enhancements

- Smart Contract Deployment
- AI-based anomaly detection
- Multi-node blockchain simulation
- Real Ethereum integration
- Live notifications

---

#  Author

### Yudhveer Sharma

Full Stack Developer 

---