const express = require('express');
const Payment = require('../models/Payment');
const PaymentController = require('../controller/payment');

const router = express.Router();
const controller = new PaymentController(Payment);

router.get('/', (req, res, next) => controller.getAllPayments(req, res, next));
router.get('/:id', (req, res, next) => controller.getPaymentById(req, res, next));
router.get('/user/:user_id', (req, res, next) => controller.getPaymentsByUser(req, res, next));
router.post('/', (req, res, next) => controller.createPayment(req, res, next));
router.put('/:id', (req, res, next) => controller.updatePayment(req, res, next));
router.delete('/:id', (req, res, next) => controller.deletePayment(req, res, next));

module.exports = router;
