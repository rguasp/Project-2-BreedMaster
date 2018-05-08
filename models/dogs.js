const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const dogsSchema = new Schema({
  name: String,
  breed: String,
  age: Number,
  furcolor: String,
  eyecolor: String,
  owner: Schema.Types.ObjectId,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Dog = mongoose.model("Dog", dogsSchema);

module.exports = Dog;