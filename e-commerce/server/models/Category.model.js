const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },

  
  
});

module.exports = mongoose.model("Category", CategorySchema);