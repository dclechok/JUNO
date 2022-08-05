const router = require("express").Router();
const controller = require("./login.controller"); //our assets route controller
const methodNotAllowed = require("../errors/methodNotAllowed"); //if methods for requests do not exist

router.route("/").post(controller.login).all(methodNotAllowed);
module.exports = router;