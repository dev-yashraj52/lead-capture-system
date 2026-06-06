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
        const { name, email, mobile, company, source } = req.body;
        const status = req.body.status || 'new';
        const statusString = String(status).toLowerCase();
        console.log(status);
        console.log(statusString);

        //validation for required fields if empty
        if (!name || !email || !mobile) {
            return res.status(400).json({
                success: false,
                message: "Name, Email, Mobile is Required!"
            });
        }

        //name validation if not string and if whitespaces
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Name should be non-empty string"
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
        if (statusString && !allowedStatus.includes(statusString)) {
            return res.status(400).json({
                success: false,
                message: "Status can only be New, Contacted, Qualified and Lost"
            });
        }

        //check if email already exists
        const emailExist = await lead.checkEmailExists(email);

        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!"
            });
        }

        const data = await lead.createNewLead({ name, email, mobile, company, source, status: statusString });

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
const updateLeadStatusById = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status || 'new';
        const statusString = String(status).toLowerCase();

        //status validation
        const allowedStatus = ['new', 'contacted', 'qualified', 'lost'];
        if (statusString && !allowedStatus.includes(statusString)) {
            return res.status(400).json({
                success: false,
                message: "Status can only be New, Contacted, Qualified and Lost"
            });
        }

        const data = await lead.updateLeadStatus({ id, status: statusString });

        if (data.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No such Lead Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead Status Updated Successfully",
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
const deleteLeadById = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await lead.deleteLead(id);

        if (data.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No such Lead Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead Deleted Successfully",
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

module.exports = {
    getLead,
    createLead,
    updateLeadStatusById,
    deleteLeadById
};