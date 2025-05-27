const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/product');


router.post('/products/add', (req, res) => productController.addProduct(req, res));
router.get('/products', (req, res) => productController.getAllProducts(req, res));
router.get('/products/:id', (req, res) => productController.getProductById(req, res));
router.put('/products/edit/:id', (req, res) => productController.updateProduct(req, res));
router.delete('/products/:id', (req, res) => productController.deleteProduct(req, res));
module.exports = router;
