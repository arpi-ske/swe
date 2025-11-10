const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ProductController = require('../controller/products');

const productModel = new Product();
const productController = new ProductController(productModel);

// product ( attribute haruulahgui)
router.get('/', productController.getProducts.bind(productController));

// neg product (attributetai )
router.get('/detail/:id', productController.getProductDetail.bind(productController));

// shine uusgeh
router.post('/', productController.createProduct.bind(productController));

// shinechleh
router.put('/:id', productController.updateProduct.bind(productController));

// ustgah
router.delete('/:id', productController.deleteProduct.bind(productController));

module.exports = router;
