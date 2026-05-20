import { useState, useEffect, useCallback } from "react";
import {
  getContractRead,
  getContractWrite,
  getCurrentAccount,
  switchRpcEndpoint,
} from "./web3Utils";

let isTransactionPending = false;

export const useAuditLog = () => {
  const [readContract, setReadContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔌 INIT CONTRACT + ACCOUNT
  useEffect(() => {
    const init = async () => {
      try {
        const contract = await getContractRead();
        setReadContract(contract);
      } catch (err) {
        console.error(err);
        setError("Contract init failed");
      }

      try {
        const acc = await getCurrentAccount();
        setAccount(acc);
      } catch (err) {
        console.warn("Wallet not connected");
      }
    };

    init();
  }, []);

  // 📥 GET ALL LOGS (READ FROM BLOCKCHAIN)
  const getAllLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!readContract) {
      setError("Contract not initialized");
      setIsLoading(false);
      return [];
    }

    try {
      const logs = await readContract.getLogs();

      return logs.map((hash, index) => ({
        id: index.toString(),
        index,
        hash,
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch logs");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [readContract]);

  // ✍️ ADD LOG (WRITE TO BLOCKCHAIN) with smart retry logic
const addLog = useCallback(async (hash) => {
  if (isTransactionPending) {
    throw new Error("⏳ Previous transaction still pending. Wait 20-30 seconds.");
  }

  setError(null);
  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      isTransactionPending = true; // 🔥 LOCK START

      const contract = await getContractWrite();

      if (!account) {
        throw new Error("Wallet not connected");
      }

      console.log(`[Attempt ${retries + 1}/${MAX_RETRIES}] Submitting transaction...`);

      const tx = await contract.addLog(hash);
      console.log(`Transaction submitted: ${tx.hash}`);

      const receipt = await tx.wait(1, 120000);

      if (!receipt) {
        throw new Error("Transaction was not mined");
      }

      console.log(`✅ Transaction confirmed: ${tx.hash}`);

      return tx;

    } catch (err) {
      const errorMsg = err.message || JSON.stringify(err);

      const isRateLimit =
        errorMsg.includes("-32002") ||
        errorMsg.includes("too many errors") ||
        errorMsg.includes("rate limit") ||
        errorMsg.includes("RPC endpoint returned too many");

      const isAlreadyPending =
        errorMsg.includes("already pending") ||
        errorMsg.includes("-32002");

      retries++;

      if (isRateLimit || isAlreadyPending) {
        if (retries < MAX_RETRIES) {
          const backoffMs = Math.pow(3, retries) * 1000;

          console.warn(
            `⚠️ RPC busy. Retrying in ${backoffMs / 1000}s (${retries}/${MAX_RETRIES})...`
          );

          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        } else {
          const msg = isAlreadyPending
            ? "⏳ Previous tx pending. Check MetaMask."
            : "⚠️ RPC overloaded. Try again after 30 sec.";

          setError(msg);
          throw new Error(msg);
        }
      }

      console.error("Transaction Error:", err);
      setError(err.message || "Transaction failed");
      throw err;

    } finally {
      isTransactionPending = false; // 🔥 LOCK RELEASE
    }
  }
}, [account]);

  return {
    account,
    isLoading,
    error,
    getAllLogs,
    addLog,
  };
};