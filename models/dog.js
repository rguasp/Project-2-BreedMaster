const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const dogsSchema = new Schema({
  name: String,
  breed: String,
  age: String,
  furcolor: String,
  eyecolor: String,
  // imgName: String,
  imgPath: String, 
   owner: String,

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Dog = mongoose.model("Dog", dogsSchema);

module.exports = Dog;