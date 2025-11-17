class ShipmentController {
  constructor(model) {
    this.model = model;
  }

  async createShipment(req, res, next) {
    try {
      const shipment = await this.model.createShipment(req.body);
      res.status(201).json({ success: true, data: shipment });
    } catch (err) {
      next(err);
    }
  }

  async getShipment(req, res, next) {
    try {
      const shipment = await this.model.getShipment(req.params.id);
      if (!shipment) {
        return res.status(404).json({ success: false, error: 'Shipment not found' });
      }
      res.status(200).json({ success: true, data: shipment });
    } catch (err) {
      next(err);
    }
  }

  async getAllShipments(req, res, next) {
    try {
      const shipments = await this.model.getAllShipments();
      res.status(200).json({ success: true, data: shipments });
    } catch (err) {
      next(err);
    }
  }

  async updateShipment(req, res, next) {
    try {
      const shipment = await this.model.updateShipment(req.params.id, req.body);
      if (!shipment) {
        return res.status(404).json({ success: false, error: 'Shipment not found' });
      }
      res.status(200).json({ success: true, data: shipment });
    } catch (err) {
      next(err);
    }
  }

  async deleteShipment(req, res, next) {
    try {
      const shipment = await this.model.deleteShipment(req.params.id);
      if (!shipment) {
        return res.status(404).json({ success: false, error: 'Shipment not found' });
      }
      res.status(200).json({ success: true, data: shipment });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ShipmentController;
