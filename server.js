const express = require("express");
const app = express();

app.get("/status", (req, res) => {
    res.json({
        morning_open: "07:00 PM",
        morning_close: "11:55 PM",
        morning_result: "12:01 PM",

        evening_open: "12:45 PM",
        evening_close: "03:55 PM",
        evening_result: "04:30 PM"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
