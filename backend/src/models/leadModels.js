const db = require('../config/db.js')

const readLead = async () => {
    const query = "SELECT * FROM leads";
    const [rows] = await db.promise().query(query);
    return rows;
};

const createNewLead = async ({ name, email, mobile, company, source, status }) => {
    const query = "INSERT INTO leads (name, email, mobile, company, source, status) VALUES (?, ?, ?, ?, ?, ?)";
    const [rows] = await db.promise().query(query, [name, email, mobile, company, source, status]);
    return rows;
};

module.exports = {
    readLead,
    createNewLead,
};