class PaymentController {
  constructor(model) {
    this.model = new model(); 
  }

  async createPayment(req, res, next) {
    try {
      const payment = await this.model.createPayment(req.body);
      res.status(201).json({ success: true, data: payment });
    } catch (err) {
      next(err);
    }
  }

  async getPaymentById(req, res, next) {
    try {
      const payment = await this.model.getPaymentById(req.params.id);
      if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
      res.status(200).json({ success: true, data: payment });
    } catch (err) {
      next(err);
    }
  }

  async getAllPayments(req, res, next) {
    try {
      const payments = await this.model.getAllPayments();
      res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (err) {
      next(err);
    }
  }

  async updatePayment(req, res, next) {
    try {
      const payment = await this.model.updatePayment(req.params.id, req.body);
      if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
      res.status(200).json({ success: true, data: payment });
    } catch (err) {
      next(err);
    }
  }

  async deletePayment(req, res, next) {
    try {
      const payment = await this.model.deletePayment(req.params.id);
      if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
      res.status(200).json({ success: true, data: payment });
    } catch (err) {
      next(err);
    }
  }

  async getPaymentsByUser(req, res, next) {
    try {
      const payments = await this.model.getPaymentsByUser(req.params.user_id);
      res.status(200).json({ success: true, data: payments });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
