const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');
const CartItem = require('../models/cart-item');
const Order = require('../models/order');
const OrderItem = require('../models/order-items');

class shopController {
  async getAllProducts(req, res) {
    const products = await Product.findAll();
    console.log(products);
    res.status(201).json({
      products: products
    });
  }

  async getCart(req, res) {
    const userCart = await req.user.getCart();
    console.log(userCart);
    const cartProducts = await userCart.getProducts();
    res.status(201).json({
      products: cartProducts
    });
  }
  async addToCart(req, res) {
    const { productId, quantity } = req.body;
  
    if (!productId || !quantity) {
      return res.status(400).json({ error: "Toote ID ja kogus on kohustuslikud" });
    }
  
    // Võta kasutaja ostukorv
    const userCart = await req.user.getCart();
  
    // Kontrolli, kas see toode on juba ostukorvis
    const productsInCart = await userCart.getProducts({ where: { id: productId } });
  
    if (productsInCart.length > 0) {
      // Kui on, võta esimene (peab olema ainult üks)
      const existingProduct = productsInCart[0];
  
      // Suurenda CartItem kogust
      existingProduct.CartItem.quantity += quantity;
  
      // Salvesta muudatus
      await existingProduct.CartItem.save();
  
      return res.status(200).json({ message: "Kogus suurendatud", product: existingProduct });
    } else {
      // Kui toode ei ole veel ostukorvis, leia see andmebaasist
      const product = await Product.findByPk(productId);
  
      if (!product) {
        return res.status(404).json({ error: "Toode ei leitud" });
      }
  
      // Lisa toode ostukorvi uue kogusega
      await userCart.addProduct(product, { through: { quantity } });
  
      return res.status(201).json({ message: "Toode lisatud ostukorvi" });
    }
  }
  

async removeFromCart(req, res) {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
    }

    const userCart = await req.user.getCart();
    const productsInCart = await userCart.getProducts({ where: { id: productId } });

    if (productsInCart.length > 0) {
        await userCart.removeProduct(productsInCart[0]);
        return res.status(200).json({ message: "Product removed from cart" });
    } else {
        return res.status(404).json({ error: "Product not found in cart" });
    }
}

async createOrder(req, res) {
    const userId = req.user.id;

    // Fetch user's cart and its items
    const userCart = await req.user.getCart();
    const cartItems = await userCart.getProducts({
      attributes: ["id", "title", "price"],
      through: { attributes: ["quantity"] },
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Your cart is empty, cannot create order." });
    }

    // Prepare order data
    const orderData = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.CartItem ? item.CartItem.quantity : 0,
    }));

    // Create a new order
    const newOrder = await Order.create({ userId });

    // Add items to the order
    const orderItemsPromises = orderData.map((data) =>
      OrderItem.create({ orderId: newOrder.id, ...data })
    );
    await Promise.all(orderItemsPromises);

    // Clear the cart after order creation
    await userCart.setProducts([]);

    return res.status(201).json({ message: "Order successfully created!", order: newOrder });
  }

  async getOrders(req, res) {
    const userId = req.user.id;

    // Fetch all orders for the user
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems', // Specify the alias used in the association
          include: [
            {
              model: Product,
              attributes: ["id", "title", "price"],
            },
          ],
        },
      ],
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user." });
    }

    return res.status(200).json({ orders });
  }
}

module.exports = new shopController();
