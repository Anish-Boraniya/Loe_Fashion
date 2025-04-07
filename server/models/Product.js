const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    size:[
      {
        id: { type: String, required: true },
        label: { type: String, required: true }
      }
    ],
    material: String,
    pattern: String,
    fit: String,
    country: String,
    color:String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
