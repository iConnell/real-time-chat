const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  login,
  register,
  verifyEmail,
  changePassword,
  resetPassword,
  resetPasswordConfirm,
  deleteAllUsers,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post(
  "/reset-password-confirm/:resetPasswordToken",
  resetPasswordConfirm
);
router.post("/change-password", authMiddleware, changePassword);

//for testing only
router.post("/delu", deleteAllUsers);

module.exports = router;
