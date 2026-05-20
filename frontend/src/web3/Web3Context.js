/**
 * Web3Context
 * Manages wallet connection and blockchain state
 */

import React, { createContext, useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import {
  isMetaMaskInstalled,
  connectWallet,
  getCurrentAccount,
  getProvider,
  formatAddress,
  getCurrentNetwork,
  getContractRead,
  getBrowserProvider,
} from "./web3Utils";
import AuditLogABI from "./AuditLogABI.json";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Restore wallet state from localStorage on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem("web3_account");
    const savedConnected = localStorage.getItem("web3_connected") === "true";

    if (savedAccount && savedConnected) {
      setAccount(savedAccount);
      setIsConnected(true);
    }
  }, []);

  // Initialize read-only contract instance with fallback provider
  useEffect(() => {
    const initContract = async () => {
      try {
        const readContract = await getContractRead();
        setContract(readContract);
      } catch (err) {
        console.error("Contract init error:", err);
        setError("Unable to initialize contract for read operations.");
      }
    };

    initContract();
  }, []);

  // Initialize signer-backed contract when wallet account changes
  useEffect(() => {
    const initSignerContract = async () => {
      if (!account || !isMetaMaskInstalled()) return;

      try {
        const signer = await getBrowserProvider().getSigner();
        const contractInstance = new ethers.Contract(
          "0xDDD96c34dB162eb14F1C61CB2B66d7E19d28f17A",
          AuditLogABI,
          signer
        );
        setContract(contractInstance);
      } catch (err) {
        console.error("Contract signer init error:", err);
      }
    };

    initSignerContract();
  }, [account]);

  // Check if MetaMask is installed
  useEffect(() => {
    setIsInstalled(isMetaMaskInstalled());
  }, []);

  // Initialize wallet connection on mount
  useEffect(() => {
    const initWallet = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const currentAccount = await getCurrentAccount();
        if (currentAccount) {
          setAccount(currentAccount);
          setIsConnected(true);
          localStorage.setItem("web3_account", currentAccount);
          localStorage.setItem("web3_connected", "true");

          // Get network
          const net = await getCurrentNetwork();
          setNetwork(net);

          // Get balance
     //   const provider = getProvider();
     //   const bal = await provider.getBalance(currentAccount);
     //   setBalance(bal.toString());
        }
      } catch (err) {
        console.error("Error initializing wallet:", err);
      }
    };

    initWallet();
  }, []);

  // Set up event listeners only once
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountChange = (newAccount) => {
      if (newAccount && newAccount.length > 0) {
        setAccount(newAccount[0]);
        setIsConnected(true);
        localStorage.setItem("web3_account", newAccount[0]);
        localStorage.setItem("web3_connected", "true");
      } else {
        setAccount(null);
        setIsConnected(false);
        localStorage.removeItem("web3_account");
        localStorage.removeItem("web3_connected");
      }
    };

    const handleNetworkChange = async (chainId) => {
      try {
        const net = await getCurrentNetwork();
        setNetwork(net);
      } catch (err) {
        console.error("Error getting network:", err);
      }
    };

    // Add listeners directly
    window.ethereum.on("accountsChanged", handleAccountChange);
    window.ethereum.on("chainChanged", handleNetworkChange);

    return () => {
      // Only remove the specific listeners we added
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
        window.ethereum.removeListener("chainChanged", handleNetworkChange);
      }
    };
  }, []);

  // Connect wallet
  const handleConnect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError("MetaMask is not installed!");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const addr = await connectWallet();
      setAccount(addr);
      setIsConnected(true);

      // Get network
      const net = await getCurrentNetwork();
      setNetwork(net);

      // Get balance
      const provider = getProvider();
      const bal = await provider.getBalance(addr);
      setBalance(bal.toString());

      return true;
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Disconnect wallet
  const handleDisconnect = useCallback(() => {
    setAccount(null);
    setIsConnected(false);
    setNetwork(null);
    setBalance(null);
    setError(null);
    localStorage.removeItem("web3_account");
    localStorage.removeItem("web3_connected");
  }, []);

  const value = {
    // State
    isConnected,
    account,
    network,
    balance,
    isInstalled,
    isLoading,
    contract,
    error,

    // Methods
    connect: handleConnect,
    disconnect: handleDisconnect,
    formatAddress: (addr) => formatAddress(addr || account),
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};



// Hook to use Web3Context
export const useWeb3 = () => {
  const context = React.useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};
