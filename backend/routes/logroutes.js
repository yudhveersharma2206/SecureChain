const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    addLog,
    verifyLog,
    getAllBlocks,
    getBlockById,
    filterBlocks
} = require("../controllers/logcontroller");

router.post("/add", authMiddleware, roleMiddleware("admin"), addLog);

// Get all blocks (no auth required for Dashboard)
router.get("/all", getAllBlocks);

// Add log (block) - Admin only
router.post("/add-log", authMiddleware, roleMiddleware("admin"), addLog);

// Get all blocks (with auth required)
router.get("/blocks", getAllBlocks);

// Filter blocks by criteria
router.get("/blocks/filter", authMiddleware, filterBlocks);

// Verify blockchain
router.get("/verify", authMiddleware, verifyLog);

// Get single block
router.get("/block/:id", authMiddleware, getBlockById);

module.exports = router;