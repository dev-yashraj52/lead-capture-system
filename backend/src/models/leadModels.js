const db = require('../config/db.js')

const readLead = async () => {
    const query = "SELECT * FROM leads";
    const [rows] = await db.promise().query(query);
    return rows;
}

module.exports = { readLead };