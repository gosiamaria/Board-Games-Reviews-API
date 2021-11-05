const usersRouter = require("express").Router();
const { getUsers, getUserByUsername } = require("../controllers/users.controllers");

usersRouter.route("/")
.get(getUsers)
.all((req, res) => { res.status(405).send({msg:'Method not allowed'})})

usersRouter.route("/:username")
.get(getUserByUsername)
.all((req, res) => { res.status(405).send({msg:'Method not allowed'})})

module.exports = usersRouter;