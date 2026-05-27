import Cart from '../models/Cart.js';

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'products.product',
      select: 'title price image stock category',
    });

    // If no cart exists yet, create one
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Synchronize local cart state to database
// @route   POST /api/cart
// @access  Private
export const syncCart = async (req, res) => {
  try {
    const { products } = req.body; // Array of { product: productId, quantity: number }

    if (!Array.isArray(products)) {
      res.status(400);
      throw new Error('Products must be a valid array');
    }

    // Clean and validate items
    const formattedProducts = products.map((item) => ({
      product: item.product,
      quantity: Number(item.quantity) || 1,
    }));

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.products = formattedProducts;
      await cart.save();
    } else {
      cart = await Cart.create({
        user: req.user._id,
        products: formattedProducts,
      });
    }

    // Populate and return updated cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'products.product',
      select: 'title price image stock category',
    });

    res.json(populatedCart);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.products = [];
      await cart.save();
    }

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
