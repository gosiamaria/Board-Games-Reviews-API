const express = require("express");
const apiRouter = require("./routes/api.router.js");
const {
    handleCustomErrors,
    handlePsqlErrors,
    handle500
} = require("./controllers/errors.controllers")


const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500);

module.exports = app;