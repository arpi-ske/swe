class CartController {
  constructor(model) {
    this.model = model;
  }

  async getCart(req, res, next) {
    try {
      const cart = await this.model.getCartByUser(req.params.user_id);
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  async getCartByUser(req, res, next) {
    try {
      const items = await this.model.getCartByUser(req.params.user_id);
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (err) {
      next(err);
    }
  }
  

  async addToCart(req, res, next) {
    try {
      const item = await this.model.addToCart(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async updateCart(req, res, next) {
    try {
      const item = await this.model.updateCart(req.params.id, req.body.quantity);
      res.status(200).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async deleteCartItem(req, res, next) {
    try {
      const item = await this.model.deleteCartItem(req.params.id);
      res.status(200).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CartController;
