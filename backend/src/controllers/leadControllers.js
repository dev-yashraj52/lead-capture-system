const lead = require('../models/leadModels.js');

const getLead = async (req, res) => {
    try {
        const data = await lead.readLead();
        return res.status(200).json({
            success: true,
            message: "Data Successfully Fetched",
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
    try {
        const { name, email, mobile, company, source, status } = req.body;

        //validation for required fields if empty
        if (!name || !email || !mobile) {
            return res.status(400).json({
                success: false,
                message: "Name, Email, Mobile is Required!"
            });
        }

        //email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email Address!"
            });
        }

        //mobile validation
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Mobile Number should be 10-digits only"
            });
        }

        //validation if status is not these four options
        const allowedStatus = ['new', 'contacted', 'qualified', 'lost'];
        if (status && !allowedStatus.includes(status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "Status can only be New, Contacted, Qualified and Lost"
            });
        }

        const data = await lead.createNewLead();

        return res.status(201).json({
            success: true,
            message: "Created New Lead Successfully",
            data: data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
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