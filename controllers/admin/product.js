const Product = require('../../models/product');

class adminController {
  async addProduct(req, res) {
    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description
    });

    res.status(201).json({
      message: 'Product is added',
      productId: product.id
    });
  }
  async getAllProducts(req, res) {
    const products = await Product.findAll();
    res.status(200).json({ products });
  }
  async getProductById(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
  }
  async updateProduct(req, res) {
    const editMode = req.query.edit === 'true';
    if (!editMode) return res.status(403).json({ message: 'Editing not allowed' });
  
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
  
    await product.update({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description
    });
  
    res.status(200).json({ message: 'Product updated', product });
  }
  async deleteProduct(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
  
    await product.destroy();
    res.status(200).json({ message: 'Product deleted' });
  }
  
}

module.exports = new adminController();
