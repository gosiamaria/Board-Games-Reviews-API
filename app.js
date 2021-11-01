const express = require("express");
const apiRouter = require("./routes/api.router.js");


const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "path not found" });
});

module.exports = app;