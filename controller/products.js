// const Products = require("../models/Product");

// exports.getProducts = async (req, res, next) => {
//     try {
//         const products = await Products.getAllProducts();
//         res.status(200).json({
//             success: true,
//             data: products,
//     });
//     } catch (err) {
//         next(err);
//     }
// };
// exports.getProductById = async (req, res, next) => {
//     try {
//         const products = await Products.getProductById(req.params.id);
//         if (!products) {
//             return res.status(400).json({
//                 success: false,
//                 error: req.params.id + " id not found",
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: products,
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// exports.updateProduct = async (req, res, next) => {
//     try {
//         const products = await Products.updateProduct(req.params.id, req.body);
//         if (!products) {
//             return res.status(400).json({
//                 success: false,
//                 error: req.params.id + " id not found",
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: products,
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// exports.createProduct = async (req, res, next) => {
//     try {
//         const products = await Products.createProduct(req.body);
//         res.status(201).json({
//             success: true,
//             data: products,
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// exports.deleteProduct = async (req, res, next) => {
//     try {
//         const products = await Products.deleteProduct(req.params.id);
//         if (!products) {
//             return res.status(400).json({
//                 success: false,
//                 error: req.params.id + " id not found",
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: products,
//         });
//     } catch (err) {
//         next(err);
//     }
// };

class ProductController {
    constructor(model) {
        this.model = model;
    }
    async getProducts(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 10;
            console.log(page, limit);
            const products = await this.model.getAllProducts(page, limit);
            res.status(200).json({
                success: true,
                data: products,
            });
        } catch (err) {
            next(err);
        }
    }
    async getProductByName(req, res, next) {
        try {
            const products = await this.model.getProductByName(req.params.name);
            if (!products) {
                return res.status(400).json({
                    success: false,
                    error: req.params.name + " name not found",
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async getProductsById(req, res, next) {
        try {
            const products = await this.model.getProductById(req.params.id);
            if (!products) {
                return res.status(400).json({
                    success: false,
                    error: req.params.id + " id not found",
                });
            }
        } catch (err) {
            next(err);
        }
    }
    async updateProduct(req, res, next) {
        try {
            const products = await this.model.updateProduct(req.params.id, req.body);
            if (!products) {
                return res.status(400).json({
                    success: false,
                    error: req.params.id + " id not found",
                });
            }   
            res.status(200).json({
                success: true,
                data: products,
            });
        } catch (err) {
            next(err);
        }
    }

    async createProduct(req, res, next) {
        try {
            const products = await this.model.createProduct(req.body);
            res.status(201).json({
                success: true,
                data: products,
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const products = await this.model.deleteProduct(req.params.id);
            if (!products) {
                return res.status(400).json({
                    success: false,
                    error: req.params.id + " id not found",
                });
            }
            res.status(200).json({
                success: true,
                data: products,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ProductController;