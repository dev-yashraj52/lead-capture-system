const express = require("express");
const cors = require("cors");
require('dotenv').config({ path: '.env' });
const leadRoutes = require('./src/routes/leadRoutes.js');

const app = express();

app.use(express.json());

app.use(cors());
app.use(leadRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
})