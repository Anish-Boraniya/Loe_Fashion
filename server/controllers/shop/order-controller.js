const paypal = require("../../helpers/paypal");
const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;


    // Validate required fields
    if (!userId || !cartItems || !addressInfo || !totalAmount || !cartId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in the request body.",
      });
    }

    // Validate totalAmount (must be a positive number)
    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid totalAmount. It must be a positive number.",
      });
    }

    console.log('Received Order Data:', {
      totalAmount,
      userId,
      cartId
    });

    const options = {
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };

    console.log('Razorpay Order Options:', options);

    try {
      const order = await razorpay.orders.create(options);
      

      
      if (!order || !order.id) {
        return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order. No order ID returned.",
         });
       }
      console.log('Razorpay Order Created:', order);
      if(order){
        
      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId: order.id,
      });

      await newlyCreatedOrder.save();

      res.status(201).json({
        success: true,
        orderId: newlyCreatedOrder._id,
        razorpayOrderId: order.id,
      });
    } 
    } catch (razorpayError) {
      console.error("Detailed Razorpay Error:", razorpayError);
      return res.status(500).json({
        success: false,
        message: "Error creating Razorpay order",
        error: razorpayError.message || razorpayError,
        fullError: razorpayError
      });
    }
  } catch (e) {
    console.error("General Error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: e.message
    });
  }
};

const crypto = require("crypto");

const capturePayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } = req.body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in the request body.",
      });
    }
    console.log("capttured payment successful")
    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(razorpayOrderId + "|" + razorpayPaymentId)
  .digest('hex');

   if (generatedSignature !== razorpaySignature) {
  return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = razorpayPaymentId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(order.cartId);

    await order.save();
    console.log("order saved")
    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.error("catured oatment failed",e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// ... rest of your controller

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
