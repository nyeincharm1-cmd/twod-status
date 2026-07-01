const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// Create default data.json
if (!fs.existsSync(DATA_FILE)) {

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify({
            morning_open: "07:00 AM",
            morning_close: "11:55 AM",
            morning_result: "12:01 PM",

            evening_open: "12:45 PM",
            evening_close: "03:55 PM",
            evening_result: "04:30 PM",

            morning_open_min: 420,
            morning_close_min: 715,

            evening_open_min: 765,
            evening_close_min: 955
        }, null, 2)
    );

}

// -------------------- GET STATUS --------------------

app.get("/status", (req, res) => {

    try {

        const data = JSON.parse(fs.readFileSync(DATA_FILE));

        const now = new Date();

        const current =
            now.getHours() * 60 +
            now.getMinutes();

        let status = "CLOSE";
        let session = "none";
        let reset_id = "";

        if (
            current >= data.morning_open_min &&
            current <= data.morning_close_min
        ) {

            status = "OPEN";
            session = "morning";

        } else if (
            current >= data.evening_open_min &&
            current <= data.evening_close_min
        ) {

            status = "OPEN";
            session = "evening";

        }

        const today =
            now.getFullYear() +
            "-" +
            String(now.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(now.getDate()).padStart(2, "0");

        if (session !== "none") {
            reset_id = today + "-" + session;
        }

        res.json({

            status,
            session,
            reset_id,

            morning_open: data.morning_open,
            morning_close: data.morning_close,
            morning_result: data.morning_result,

            evening_open: data.evening_open,
            evening_close: data.evening_close,
            evening_result: data.evening_result

        });

    } catch (e) {

        res.status(500).json({
            success: false,
            error: e.message
        });

    }

});

// -------------------- SAVE STATUS --------------------

app.post("/status", (req, res) => {

    try {

        const body = req.body;

        const saveData = {

            morning_open: body.morning_open,
            morning_close: body.morning_close,
            morning_result: body.morning_result,

            evening_open: body.evening_open,
            evening_close: body.evening_close,
            evening_result: body.evening_result,

            morning_open_min: body.morning_open_min,
            morning_close_min: body.morning_close_min,

            evening_open_min: body.evening_open_min,
            evening_close_min: body.evening_close_min

        };

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(saveData, null, 2)
        );

        res.json({
            success: true,
            message: "Saved Successfully"
        });

    } catch (e) {

        res.status(500).json({
            success: false,
            error: e.message
        });

    }

});

app.listen(PORT, () => {
    console.log("Server Running On Port " + PORT);
});
