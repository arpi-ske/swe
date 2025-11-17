const express = require('express');
const Shipment = require('../models/Shipment');
const ShipmentController = require('../controller/shipment');

const router = express.Router();
const shipmentModel = new Shipment();      
const controller = new ShipmentController(shipmentModel);

router.post('/', (req, res, next) => controller.createShipment(req, res, next));
router.get('/', (req, res, next) => controller.getAllShipments(req, res, next));
router.get('/:id', (req, res, next) => controller.getShipment(req, res, next));
router.put('/:id', (req, res, next) => controller.updateShipment(req, res, next));
router.delete('/:id', (req, res, next) => controller.deleteShipment(req, res, next));

module.exports = router;
