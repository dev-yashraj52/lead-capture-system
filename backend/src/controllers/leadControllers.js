const lead = require('../models/leadModels.js');

const getLead = async (req, res) => {
    try {
        const data = await lead.readLead();
        return res.status(200).json({
            success: true,
            message: "Request Accepted",
            data: data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
};

const createLead = async (req, res) => {
    res.send("createLead");
}
const updateLeadById = async (req, res) => {
    res.send("updateLeadById");
}
const deleteLeadById = async (req, res) => {
    res.send("deleteLeadById");
}

module.exports = {
    getLead,
    createLead,
    updateLeadById,
    deleteLeadById
};