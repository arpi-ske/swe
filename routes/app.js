// routes/app.js
const express = require("express");
const { uploadSingle, getFileByName } = require("../controller/app");
const authGuard = require("../middleware/authGuard");
const { requireRoles, ROLES } = require("../middleware/roleGuard"); 

const router = express.Router();


router.route("/upload").post(authGuard, requireRoles(ROLES.USER), uploadSingle);


router.route("/file/:filename").get(getFileByName);

module.exports = router;
