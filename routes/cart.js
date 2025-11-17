
const express = require('express');
const Cart = require('../models/Cart');
const CartController = require('../controller/cart');

const router = express.Router();
const cartModel = new Cart();
const controller = new CartController(cartModel);

router.get('/:user_id', (req, res, next) => controller.getCartByUser(req, res, next));
router.post('/', (req, res, next) => controller.addToCart(req, res, next));
router.put('/:id', (req, res, next) => controller.updateCartItem(req, res, next));
router.delete('/:id', (req, res, next) => controller.deleteCartItem(req, res, next));

module.exports = router;
