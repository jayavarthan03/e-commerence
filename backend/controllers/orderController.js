import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create a new order & deplete inventory stock
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    const { products, shippingAddress, totalPrice, paymentResult } = req.body;

    if (!products || products.length === 0) {
      res.status(400);
      throw new Error('No order items provided');
    }

    // Verify stock availability and collect items with full product details
    const orderItems = [];
    for (const item of products) {
      const dbProduct = await Product.findById(item.product);
      
      if (!dbProduct) {
        res.status(404);
        throw new Error(`Product not found: ${item.title}`);
      }

      if (dbProduct.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${dbProduct.title}. Only ${dbProduct.stock} left.`);
      }

      // Decrement stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();

      orderItems.push({
        product: dbProduct._id,
        title: dbProduct.title,
        image: dbProduct.image,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }

    // Create the order in database
    const order = new Order({
      user: req.user._id,
      products: orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod: 'Credit/Debit Card',
      paymentStatus: 'Paid', // Pre-approve transaction in this simulation
      paidAt: Date.now(),
      paymentResult: {
        id: paymentResult?.id || 'fake_tx_' + Math.random().toString(36).substr(2, 9),
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      },
    });

    const createdOrder = await order.save();

    // Clear backend cart for the user
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.products = [];
      await cart.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Allow only the order owner or an admin to access details
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }

      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    // Populate user details
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order shipping/delivery status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body; // 'Pending', 'Processing', 'Shipped', 'Delivered'
    
    const order = await Order.findById(req.params.id);

    if (order) {
      if (orderStatus) {
        order.orderStatus = orderStatus;
        if (orderStatus === 'Delivered') {
          order.deliveredAt = Date.now();
        }
      }
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};
