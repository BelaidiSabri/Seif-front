const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  numtel: { type: String, required: true },
  adresse: { type: String, required: true },
  communauté: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  quantityDispo: { type: Number },
  images: [{type:String}],
  status: {type:String}
  
});

module.exports = mongoose.model("Product", ProductSchema);