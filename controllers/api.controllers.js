const { fetchEndpoints } = require("../models/api.models.js");

exports.getEndpoints = (req, res, next) => {
    const endpoints = fetchEndpoints()
    res.status(200).send( { endpoints })
}