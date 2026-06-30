const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "data.json");

// CORS Package မလိုဘဲ Android App က လှမ်းခေါ်လို့ရအောင် လက်ခံပေးမည့် Native Middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // Android က Preflight (OPTIONS) request လှမ်းပို့ရင် OK ပြန်ပေးရန်
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Server စပွင့်ချိန်မှာ data.json ဖိုင် မရှိသေးရင် မူရင်းအချိန်တွေကို အလိုအလျောက် ဆောက်ပေးမယ်
if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
        morning_open: "07:00 PM",
        morning_close: "11:55 PM",
        morning_result: "12:01 PM",
        evening_open: "12:45 PM",
        evening_close: "03:55 PM",
        evening_result: "04:30 PM",
        morning_open_min: 1140,         // 19 * 60
        morning_close_min: 1435,        // 23 * 60 + 55
        evening_open_min: 765,          // 12 * 60 + 45
        evening_close_min: 955          // 15 * 60 + 55
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

// 1. GET /status (အခြေအနေ စစ်ဆေးခြင်းနှင့် အချိန်များ ထုတ်ပေးခြင်း)
app.get("/status", (req, res) => {
    try {
        const rawData = fs.readFileSync(DATA_FILE, "utf8");
        const savedData = JSON.parse(rawData);

        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const current = hour * 60 + minute;

        let status = "CLOSE";

        if (
            (current >= savedData.morning_open_min && current <= savedData.morning_close_min) ||
            (current >= savedData.evening_open_min && current <= savedData.evening_close_min)
        ) {
            status = "OPEN";
        }

        res.json({
            status: status,
            morning_open: savedData.morning_open,
            morning_close: savedData.morning_close,
            morning_result: savedData.morning_result,
            evening_open: savedData.evening_open,
            evening_close: savedData.evening_close,
            evening_result: savedData.evening_result
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to read data" });
    }
});

// 2. POST /update (Admin App ကနေ SAVE နှိပ်ရင် အချိန်အသစ်တွေ လာသိမ်းမယ့်နေရာ)
app.post("/update", (req, res) => {
    try {
        const newData = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
        res.json({
            message: "Data updated successfully!",
            updatedData: newData
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to update data" });
    }
});

app.listen(process.env.PORT || 3000);
