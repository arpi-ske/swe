class ProductController {
  constructor(model) {
    this.model = model;
  }

  // buh buteegdehuun, (attribute haruulahgui)
  async getProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const products = await this.model.getAllProducts({ page, limit });

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (err) {
      next(err);
    }
  }

  // neg buteegdehuun, attribute haruulah
  async getProductDetail(req, res, next) {
    try {
      const product = await this.model.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      const attributes = await this.model.getAttributesByProductId(req.params.id);

      res.status(200).json({
        success: true,
        data: {
          ...product,
          attributes
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // shine buteegdehuun uusgeh
  async createProduct(req, res, next) {
    try {
      const product = await this.model.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  // buteegdehuun shinechleh
  async updateProduct(req, res, next) {
    try {
      const product = await this.model.updateProduct(req.params.id, req.body);
      if (!product) return res.status(404).json({ success: false, error: "Product not found" });

      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  // buteegdehuun ustgah
  async deleteProduct(req, res, next) {
    try {
      const product = await this.model.deleteProduct(req.params.id);
      if (!product) return res.status(404).json({ success: false, error: "Product not found" });

      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
