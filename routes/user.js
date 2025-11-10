const express = require("express");
const { register, login, profile } = require("../controller/user");
const authGuard = require("../middleware/authGuard");
const { requireRoles, ROLES } = require("../middleware/roleGuard");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.get("/profile", authGuard, profile);


router.get("/", authGuard, requireRoles(ROLES.ADMIN), async (req,res)=>{
  const users = await require("../models/User").getAllUsers();
  res.json({ success:true, users });
});

module.exports = router;
