class OrderController {
  constructor(model) {
    this.model = model;
  }

  async getAllOrders(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const orders = await this.model.getAllOrders({ page, limit });
      res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      next(err);
    }
  }

  async getOrdersByUser(req, res, next) {
    try {
      const user_id = req.params.user_id;
      const orders = await this.model.getOrdersByUser(user_id);
      res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      next(err);
    }
  }

  async createOrder(req, res, next) {
    try {
      const order = await this.model.createOrder(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const order = await this.model.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: "Order not found" });
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async updateOrder(req, res, next) {
    try {
      const order = await this.model.updateOrder(req.params.id, req.body);
      if (!order) return res.status(404).json({ success: false, error: "Order not found" });
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async deleteOrder(req, res, next) {
    try {
      const order = await this.model.deleteOrder(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: "Order not found" });
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderController;
