const router = require("express").Router();
const controller = require("./history_log.controller"); //our assets route controller
const methodNotAllowed = require("../errors/methodNotAllowed"); //if methods for requests do not exist

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
router.route("/:history_key").get(controller.read).all(methodNotAllowed);

module.exports = router;