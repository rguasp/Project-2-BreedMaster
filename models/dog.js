const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const User = require('./user');

const dogsSchema = new Schema({
  name: String,
  breed: String,
  age: String,
  furcolor: String,
  eyecolor: String,
  // imgName: String,
  imgPath: {type: String, default:"/images/dog-default-yellow.jpg"}, 
  owner: String,
  createdBy:{type: Schema.Types.ObjectId, ref: "User" }

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Dog = mongoose.model("Dog", dogsSchema);

module.exports = Dog;