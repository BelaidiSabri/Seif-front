const mongoose = require("mongoose");
const EchangeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  firstUser: { type: mongoose.Types.ObjectId, ref: "user" },
  seconddUser: { type: mongoose.Types.ObjectId, ref: "user" },
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
});

module.exports = mongoose.model("Echange", EchangeSchema);