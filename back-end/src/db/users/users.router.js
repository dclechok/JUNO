const router = require("express").Router();
const controller = require("./users.controller"); //our assets route controller
const methodNotAllowed = require("../errors/methodNotAllowed"); //if methods for requests do not exist

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
router.route("/:user_id").get(controller.read).put(controller.update).all(methodNotAllowed);
router.route("/deactivate/:user_id").put(controller.deactivate).all(methodNotAllowed);
module.exports = router;