const CartModel = require("../models/Cart");

// --- USER CART ---
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await CartModel.getCartItems(userId);

    res.json({
      success: true,
      user_id: userId,
      total_items: items.length,
      data: items,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user.id;

    const item = await CartModel.addItem(userId, product_id, quantity || 1);

    res.status(201).json({
      success: true,
      message: "Сагсанд нэмэгдлээ",
      data: item,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const item = await CartModel.updateItem(
      req.user.id,
      req.params.itemId,
      quantity
    );

    if (!item)
      return res.status(404).json({ success: false, message: "Item not found" });

    res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const item = await CartModel.removeItem(req.user.id, req.params.itemId);

    if (!item)
      return res.status(404).json({ success: false, message: "Item not found" });

    res.json({ success: true, message: "Removed" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// --- ADMIN: бүх хэрэглэгчийн cart ---
exports.adminGetAllCarts = async (req, res) => {
  try {
    const carts = await CartModel.getAllCarts();
    const cartIds = carts.map((c) => c.cart_id);
    const items = await CartModel.getItemsByCartIds(cartIds);

    // Cart бүрийн items-г group хийх
    const grouped = {};
    items.forEach((it) => {
      if (!grouped[it.cart_id]) grouped[it.cart_id] = [];
      grouped[it.cart_id].push(it);
    });

    const final = carts.map((c) => ({
      cart_id: c.cart_id,
      user_id: c.user_id,
      checked_out: c.order_id !== null,
      order_id: c.order_id,
      created_at: c.created_at,
      updated_at: c.updated_at,
      items: grouped[c.cart_id] || [],
    }));

    res.json({ success: true, total_carts: final.length, carts: final });
  } catch (err) {
    console.error("adminGetAllCarts error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      detail: err.message,
    });
  }
};
