// routes/app.js
const express = require("express");
const { uploadSingle, getFileByName } = require("../controller/app");
const authGuard = require("../middleware/authGuard");
const { requireRoles, ROLES } = require("../middleware/roleGuard"); // зөв import

const router = express.Router();

// 🔹 Зөвхөн USER role-тэй хэрэглэгч upload хийх боломжтой
router.route("/upload").post(authGuard, requireRoles(ROLES.USER), uploadSingle);

// 🔹 Файл авах (зөвшөөрөлгүй route)
router.route("/file/:filename").get(getFileByName);

module.exports = router;
