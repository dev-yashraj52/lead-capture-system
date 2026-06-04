const express = require("express");
require('dotenv').config({ path: '.env' });

const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
})