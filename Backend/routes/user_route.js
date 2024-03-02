const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user_controller");

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUserById);

router.post("/", UserController.postUsers);

router.put("/:id", UserController.putUsers);

router.delete("/:id", UserController.deleteUsers);

module.exports = router;