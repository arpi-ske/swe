const express = require("express");
const router = express.Router();
const authGuard = require("../middleware/authGuard");
const { requireRoles, ROLES } = require("../middleware/roleGuard");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controller/cart");

const cartController = require("../controller/cart");

// бүх route-ууд authentication шаардана
router.use(authGuard);

// User cart үйлдлүүд
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:itemId", updateCartItem);
router.delete("/:itemId", removeCartItem);

// Admin — бүх хэрэглэгчийн cart харах
router.get(
  "/admin/all",
  requireRoles(ROLES.ADMIN),  // зөвхөн админ
  cartController.adminGetAllCarts.bind(cartController)
);

module.exports = router;
