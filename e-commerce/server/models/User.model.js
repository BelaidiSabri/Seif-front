const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  contacts: [{ type: mongoose.Types.ObjectId, ref: "User" }] // Array of User ObjectIds
});

module.exports = mongoose.model("User", UserSchema);
