const express = require("express");
const app = express();

app.get("/status", (req, res) => {

    const now = new Date();

    const hour = now.getHours();
    const minute = now.getMinutes();

    const current = hour * 60 + minute;

    // 7:00 PM
    const morningOpen = 19 * 60;

    // 11:55 PM
    const morningClose = 23 * 60 + 55;

    // 12:45 PM
    const eveningOpen = 12 * 60 + 45;

    // 3:55 PM
    const eveningClose = 15 * 60 + 55;

    let status = "CLOSE";

    if (
        (current >= morningOpen && current <= morningClose) ||
        (current >= eveningOpen && current <= eveningClose)
    ) {
        status = "OPEN";
    }

    res.json({

        status: status,

        morning_open: "07:00 PM",
        morning_close: "11:55 PM",
        morning_result: "12:01 PM",

        evening_open: "12:45 PM",
        evening_close: "03:55 PM",
        evening_result: "04:30 PM"

    });

});

app.listen(process.env.PORT || 3000);
