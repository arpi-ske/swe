// routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/user"); 

// 🔹 Бүртгэх
router.post("/register", register);

// 🔹 Нэвтрэх
router.post("/login", login);

module.exports = router;
