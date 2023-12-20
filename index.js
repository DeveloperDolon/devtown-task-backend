require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    try {

        res.send("Mobile Shop Server is running");

    } catch(err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log("Listening on port " + port);
})