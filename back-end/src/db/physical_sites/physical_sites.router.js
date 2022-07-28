const router = require("express").Router();
const controller = require("./physical_sites.controller"); //our assets route controller
const methodNotAllowed = require("../errors/methodNotAllowed"); //if methods for requests do not exist

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);//.post(controller.create);//.all(methodNotAllowed);
router.route("/:physical_site_id").get(controller.read).put(controller.update).all(methodNotAllowed);
router.route("/deactivate/:physical_site_id").put(controller.remove).all(methodNotAllowed);
module.exports = router;