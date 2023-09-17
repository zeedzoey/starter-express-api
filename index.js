const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the "Tip_Coin_files" directory
app.use(express.static(path.join(__dirname, "")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "thetipcoin.html"));
});

app.listen(process.env.PORT || 3000)

