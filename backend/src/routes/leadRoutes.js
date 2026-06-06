const express = require("express");
const router = express.Router();

const { getLead,
    createLead,
    updateLeadStatusById,
    deleteLeadById
} = require("../controllers/leadControllers.js")

router.get("/leads", getLead);
router.post("/leads", createLead);
router.put("/leads/:id/status", updateLeadStatusById);
router.delete("/leads/:id", deleteLeadById);

module.exports = router;