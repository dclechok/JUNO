const router = require("express").Router();
const controller = require("./assets.controller"); //our assets route controller
const methodNotAllowed = require("../errors/methodNotAllowed"); //if methods for requests do not exist

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
router.route("/:asset_id").get(controller.read).delete(controller.delete).all(methodNotAllowed);

module.exports = router;