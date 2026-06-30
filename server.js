app.get("/status", (req, res) => {
    res.json({
        status: "CLOSE",
        open_time: "12:45",
        close_time: "15:55"
    });
});
