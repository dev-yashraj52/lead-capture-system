const express = require("express");
require('dotenv').config({ path: '.env' });
const leadRoutes = require('./src/routes/leadRoutes.js');

const app = express();

app.use(express.json());

app.use(leadRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
})