const usersRouter = require("express").Router();
const { getUsers, getUserByUsername } = require("../controllers/users.controllers");
const { handleNotAllowedMethods } = require('../controllers/errors.controllers');

usersRouter.route("/")
.get(getUsers)
.all(handleNotAllowedMethods)

usersRouter.route("/:username")
.get(getUserByUsername)
.all(handleNotAllowedMethods)

module.exports = usersRouter;