// const express = require('express');
// const authGuard = require('../middleware/authGuard');

// const {
//     getProducts,
//     getProductById,  
//     createProduct,
//     updateProduct,
//     deleteProduct,
// } = require("../controller/products");

// const router = express.Router();

// router.route('/')
//   .get(getProducts)
//     .post(authGuard, createProduct);

// router.route('/:id')
//   .get(getProductById)  
//   .put(authGuard, updateProduct)
//   .delete(authGuard, deleteProduct);

// module.exports = router;

const express = require("express");
const ProductController  = require("../controller/products");
const Product  = require("../models/Product");

const router = express.Router();
const product = new ProductController(new Product());
router.route("/").get(product.getProducts.bind(product)).post(product.createProduct.bind(product));
router.route("/:id").get(product.getProductsById.bind(product));
module.exports = router;