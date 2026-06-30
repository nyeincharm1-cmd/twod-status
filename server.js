const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("TWOD Status API Running");
});

app.get("/status", (req, res) => {
  const data = JSON.parse(fs.readFileSync("status.json"));
  res.json(data);
});

app.listen(PORT, () => {
  console.log("Server running...");
});
