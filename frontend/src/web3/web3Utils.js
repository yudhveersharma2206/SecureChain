/**
 * Web3 Utilities
 * Handles blockchain interaction using ethers.js
 */
import ABI from "./AuditLogABI.json";
import { ethers } from "ethers";

// ✅ Use Alchemy (free tier) instead of publicnode - much better rate limiting
// If you want to use your own RPC, replace ALCHEMY_KEY with your key
const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY || "demo";
const FALLBACK_RPC_URLs = [
  `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  "https://rpc2.sepolia.org",
  "https://ethereum-sepolia.publicnode.com",
];

// Contract ABI - imported from deployment artifacts
let CONTRACT_ABI = ABI;
let CONTRACT_ADDRESS = "0xDDD96c34dB162eb14F1C61CB2B66d7E19d28f17A";
let currentRpcIndex = 0;

export const setContractABI = (abi) => {
  CONTRACT_ABI = abi;
};

export const setContractAddress = (address) => {
  CONTRACT_ADDRESS = address;
};

// ✅ Try multiple RPC endpoints if one fails
export const getRpcProvider = () => {
  const url = FALLBACK_RPC_URLs[currentRpcIndex];
  console.debug(`Using RPC endpoint: ${url.split('/')[2]}`);
  return new ethers.JsonRpcProvider(url);
};

export const switchRpcEndpoint = () => {
  currentRpcIndex = (currentRpcIndex + 1) % FALLBACK_RPC_URLs.length;
  console.warn(`⚠️ Switching RPC endpoint to: ${FALLBACK_RPC_URLs[currentRpcIndex].split('/')[2]}`);
  return getRpcProvider();
};

export const getBrowserProvider = () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed!");
  }
  // ✅ MetaMask provider uses internal RPC, not our FALLBACK_RPC_URL
  return new ethers.BrowserProvider(window.ethereum);
};

export const getProvider = () => {
  // ✅ PREFER MetaMask for all operations when available
  // Only fall back to public RPC for read-only operations
  if (isMetaMaskInstalled()) {
    try {
      return new ethers.BrowserProvider(window.ethereum);
    } catch (err) {
      console.warn("BrowserProvider failed, falling back to JsonRpcProvider:", err);
    }
  }
  return getRpcProvider();
};

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
};

/**
 * Request wallet connection
 */
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed!");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    if (error?.code === 4001) {
      throw new Error("User rejected wallet connection");
    }
    throw error;
  }
};

/**
 * Get current wallet address
 */
export const getCurrentAccount = async () => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
};

/**
 * Get signer for write operations
 * ✅ Always uses MetaMask (no public RPC)
 */
export const getSigner = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask required for transactions. Please install MetaMask.");
  }
  const browserProvider = getBrowserProvider();
  return browserProvider.getSigner();
};

/**
 * Get contract instance (read-only)
 */
export const getContractRead = async () => {
  if (!CONTRACT_ABI) {
    throw new Error("Contract ABI not set!");
  }
  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address not set!");
  }

  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

/**
 * Get contract instance (with signer for write operations)
 */
export const getContractWrite = async () => {
  if (!CONTRACT_ABI) {
    throw new Error("Contract ABI not set!");
  }
  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address not set!");
  }

  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

/**
 * Get wallet balance
 */
export const getBalance = async (address) => {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};

/**
 * Get current network
 */
export const getCurrentNetwork = async () => {
  const provider = getProvider();
  const network = await provider.getNetwork();
  return {
    name: network.name,
    chainId: network.chainId,
  };
};

/**
 * Switch network (requires MetaMask)
 */
export const switchNetwork = async (chainId) => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed!");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (error) {
    if (error?.code === 4902) {
      throw new Error("Network not found in MetaMask. Please add it manually.");
    }
    throw error;
  }
};

/**
 * Listen for account changes
 */
export const onAccountChange = (callback) => {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.on("accountsChanged", (accounts) => {
    callback(accounts[0] || null);
  });
};

/**
 * Listen for network changes
 */
export const onNetworkChange = (callback) => {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.on("chainChanged", (chainId) => {
    callback(parseInt(chainId, 16));
  });
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Validate address
 */
export const isValidAddress = (address) => {
  return ethers.isAddress(address);
};

/**
 * Convert wei to ether
 */
export const weiToEther = (wei) => {
  return ethers.formatEther(wei);
};

/**
 * Convert ether to wei
 */
export const etherToWei = (ether) => {
  return ethers.parseEther(ether.toString());
};

/**
 * Wait for transaction confirmation
 */
export const waitForTransaction = async (txHash, confirmations = 1) => {
  const provider = getProvider();
  return provider.waitForTransaction(txHash, confirmations);
};

/**
 * Get transaction details
 */
export const getTransactionDetails = async (txHash) => {
  const provider = getProvider();
  return provider.getTransaction(txHash);
};
