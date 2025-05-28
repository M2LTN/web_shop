const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/cart', (req, res) => shopController.getCart(req, res));
router.post('/cart/add', (req, res) => shopController.addToCart(req, res)); // Add to cart 
router.post('/cart/remove', (req, res) => shopController.removeFromCart(req, res)); // Remove from cart
module.exports = router;
