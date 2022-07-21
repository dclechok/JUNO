const router = require("express").Router();
const controller = require("./physical_sites.controller"); //our assets route controller
const methodNotAllowed = require("../errors/methodNotAllowed"); //if methods for requests do not exist

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);//.post(controller.create);//.all(methodNotAllowed);
router.route("/:id").put(controller.update).all(methodNotAllowed);

module.exports = router;