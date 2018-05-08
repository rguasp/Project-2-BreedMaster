const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const productsSchema = new Schema({
  name: String,
  description: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Product = mongoose.model("Product", productsSchema);

module.exports = Product;