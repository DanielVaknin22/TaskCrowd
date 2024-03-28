const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profile_controller');
const UserController = require("../controllers/user_controller");

router.get('/profile', profileController.getUserProfile);
router.put('/profile', profileController.updateUserProfile);

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUserById);

router.post("/", UserController.postUsers);
router.post('/register', UserController.registerUser);
router.post("/login", UserController.loginUser);


router.put("/:id", UserController.putUsers);

router.delete("/:id", UserController.deleteUsers);

module.exports = router;