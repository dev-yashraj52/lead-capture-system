const express = require("express");
const router = express.Router();

const { getLead,
    createLead,
    updateLeadById,
    deleteLeadById
} = require("../controllers/leadControllers.js")

router.get("/leads", getLead);
router.post("/leads", createLead);
router.put("/leads/:id", updateLeadById);
router.delete("/leads/:id", deleteLeadById);

module.exports = router;