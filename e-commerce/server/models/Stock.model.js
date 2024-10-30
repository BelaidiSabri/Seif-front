const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  idLibraire: { type: mongoose.Types.ObjectId, ref: "Librairie" },
  idFournisseur: { type: mongoose.Types.ObjectId, ref: "Fournisseur" },
  prixAchat: { type: String, required: true },
});

module.exports = mongoose.model("Stock", StockSchema);