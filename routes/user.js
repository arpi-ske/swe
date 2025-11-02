const express = require("express");
const { register, login, profile } = require("../controller/user");
const authGuard = require("../middleware/authGuard");
const { requireRoles, ROLES } = require("../middleware/roleGuard");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Өөрийн profile-г харах (user болон admin)
router.get("/profile", authGuard, profile);

// Админ хэрэглэгч бүх users-г харах
router.get("/", authGuard, requireRoles(ROLES.ADMIN), async (req,res)=>{
  const users = await require("../models/user").getAllUsers();
  res.json({ success:true, users });
});

module.exports = router;
