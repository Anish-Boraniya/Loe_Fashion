const razorpay = require("razorpay");
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_C2aJkyB0BsiAUI" ,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;