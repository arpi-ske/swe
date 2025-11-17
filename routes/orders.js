const express = require('express');
const Order = require('../models/Order');
const OrderController = require('../controller/orders');

const router = express.Router();

const orderModel = new Order();

const controller = new OrderController(orderModel);

router.get('/', (req, res, next) => controller.getAllOrders(req, res, next));
router.get('/user/:user_id', (req, res, next) => controller.getOrdersByUser(req, res, next));
router.get('/:id', (req, res, next) => controller.getOrderById(req, res, next));
router.post('/', (req, res, next) => controller.createOrder(req, res, next));
router.put('/:id', (req, res, next) => controller.updateOrder(req, res, next));
router.delete('/:id', (req, res, next) => controller.deleteOrder(req, res, next));

module.exports = router;
