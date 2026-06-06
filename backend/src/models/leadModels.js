const db = require('../config/db.js')

const readLead = async () => {
    const query = "SELECT * FROM leads";
    const [result] = await db.promise().query(query);
    return result;
};

const createNewLead = async ({ name, email, mobile, company, source, status }) => {
    const query = "INSERT INTO leads (name, email, mobile, company, source, status) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.promise().query(query, [name, email, mobile, company, source, status]);
    return result;
};

const checkEmailExists = async (email) => {
    const query = "SELECT id FROM leads WHERE email = ? LIMIT 1";
    const [result] = await db.promise().query(query, [email]);
    return result.length > 0;
}

const updateLeadStatus = async ({ id, status }) => {
    const query = "UPDATE leads SET status = ? WHERE id = ?";
    const [result] = await db.promise().query(query);
    return result;
}

module.exports = {
    readLead,
    createNewLead,
    checkEmailExists,
    updateLeadStatus
};