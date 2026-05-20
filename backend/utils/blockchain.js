const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
process.env.CONTRACT_ADDRESS,
require("../abi/AuditLogABI.json"),
wallet
);

const addLogToBlockchain = async (hash) => {
try {
    const tx = await contract.addLog(hash);
    await tx.wait();
    return tx.hash;
} catch (err) {
    console.error("Blockchain Error:", err);
    throw err;
}
};

module.exports = { addLogToBlockchain };