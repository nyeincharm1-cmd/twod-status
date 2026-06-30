const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Android App ကနေ လှမ်းခေါ်ရင် CORS Error မတက်အောင်လို့ပါ

const app = express();
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json()); // Android က ပို့လိုက်တဲ့ JSON Body ကို ဖတ်နိုင်အောင်လို့ပါ

// Server စပွင့်ချိန်မှာ data.json ဖိုင် မရှိသေးရင် သင့်ရဲ့ မူရင်း အချိန်တွေကို အလိုအလျောက် သွားသိမ်းပေးမယ်
if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
        morning_open: "07:00 PM",
        morning_close: "11:55 PM",
        morning_result: "12:01 PM",
        evening_open: "12:45 PM",
        evening_close: "03:55 PM",
        evening_result: "04:30 PM",
        // တွက်ချက်မှုအပိုင်းအတွက် မိနစ်တွေကိုပါ တစ်ခါတည်း သိမ်းထားပေးပါမယ်
        morning_open_min: 19 * 60,         // 1140
        morning_close_min: 23 * 60 + 55,   // 1435
        evening_open_min: 12 * 60 + 45,    // 765
        evening_close_min: 15 * 60 + 55    // 955
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

// 1. GET /status (အခြေအနေ စစ်ဆေးခြင်းနှင့် အချိန်များ ထုတ်ပေးခြင်း)
app.get("/status", (req, res) => {
    try {
        // data.json ထဲက လက်ရှိ သိမ်းထားတဲ့ အချိန်တွေကို ဖတ်ယူမယ်
        const rawData = fs.readFileSync(DATA_FILE, "utf8");
        const savedData = JSON.parse(rawData);

        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const current = hour * 60 + minute;

        let status = "CLOSE";

        // ဖိုင်ထဲက ဖတ်ရရှိတဲ့ မိနစ်တန်ဖိုးတွေနဲ့ တိုက်စစ်မယ်
        if (
            (current >= savedData.morning_open_min && current <= savedData.morning_close_min) ||
            (current >= savedData.evening_open_min && current <= savedData.evening_close_min)
        ) {
            status = "OPEN";
        }

        // သင့်ရဲ့ မူရင်း JSON Output Format အတိုင်း ပြန်ထုတ်ပေးတာဖြစ်ပါတယ်
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
        const newData = req.body; // Admin App က ပို့လိုက်တဲ့ JSON အချက်အလက်

        // data.json ထဲကို အစားထိုးပြီး ချက်ချင်း ရေးလိုက်ခြင်း
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
