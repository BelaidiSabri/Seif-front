const Donation = require("../models/Donation.model");
const NotificationModel = require("../models/Notification.model");
const Product = require("../models/Product.model");
const mongoose = require("mongoose");

// Demander une donation
exports.requestDonation = async (req, res) => {
  const { productId } = req.body;

  try {
    // Find the product in the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    // Ensure the product belongs to someone else
    if (product.user.toString() === req.user.id) {
      return res.status(403).json({
        message: "Vous ne pouvez pas demander un produit que vous possédez.",
      });
    }

    // Ensure the product is available for donation
    if (product.status !== "don") {
      return res.status(400).json({
        message: "Ce produit n'est pas disponible pour une donation.",
      });
    }

    // Check if user has already requested this product
    const existingRequest = await Donation.findOne({
      product: productId,
      donatedTo: req.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Vous avez déjà une demande en cours pour ce produit.",
      });
    }

    // Check total number of pending requests
    const pendingRequestsCount = await Donation.countDocuments({
      product: productId,
      status: 'pending'
    });

    // Optional: Limit the number of pending requests (e.g., max 5)
    if (pendingRequestsCount >= 5) {
      return res.status(400).json({
        message: "Trop de demandes en cours pour ce produit.",
      });
    }

    // Create a new donation request
    const donation = new Donation({
      product: productId,
      donatedBy: product.user, // Owner of the product
      donatedTo: req.user.id, // Current user requesting the donation
      status: "pending",
    });

    await donation.save();

    // Create a notification for the product owner
    await NotificationModel.create({
      user: product.user,
      message: `Un utilisateur a demandé votre produit "${product.nom}".`,
      type: "donation_requested",
      donation: donation._id,
    });

    res.status(201).json({
      message: "Demande de donation créée avec succès.",
      donation: await donation.populate([
        "product",
        "donatedBy",
        "donatedTo",
      ]),
    });
  } catch (error) {
    console.error("Erreur lors de la demande de donation :", error);
    res.status(500).json({
      message: "Erreur lors de la création de la demande de donation.",
      error: error.message,
    });
  }
};

// Récupérer les donations pour l'utilisateur connecté
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      $or: [{ donatedTo: req.user.id }, { donatedBy: req.user.id }],
    })
      .populate("product", "nom images")
      .populate("donatedBy", "username email")
      .populate("donatedTo", "username email");

    const donationsWithRoles = donations.map((donation) => {
      const isDonor = donation.donatedBy._id.toString() === req.user.id;
      const isRecipient = donation.donatedTo._id.toString() === req.user.id;

      return {
        ...donation.toObject(),
        userRole: isDonor ? "donor" : "recipient",
        actions:
          donation.status === "pending"
            ? {
                canAccept: isDonor,
                canDecline: isDonor,
                canCancel: isRecipient,
              }
            : {
                canAccept: false,
                canDecline: false,
                canCancel: false,
              },
      };
    });

    res.status(200).json({ donations: donationsWithRoles });
  } catch (error) {
    console.error("Erreur lors de la récupération des donations :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des donations.",
      error: error.message,
    });
  }
};

// Mettre à jour le statut d'une donation (accepter/rejeter)
exports.updateDonationStatus = async (req, res) => {
  const { status } = req.body;
  const donationId = req.params.id;

  try {
    const donation = await Donation.findById(donationId).populate([
      "product",
      "donatedBy",
      "donatedTo",
    ]);

    if (!donation) {
      return res.status(404).json({ message: "Donation introuvable." });
    }

    // Only the product owner can accept/reject
    if (donation.donatedBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à mettre à jour cette donation.",
      });
    }

    if (donation.status !== "pending") {
      return res.status(400).json({
        message: "Cette donation n'est plus en attente.",
      });
    }

    if (status === "accepted") {
      // Mettre à jour le statut du produit et de la donation
      await Product.findByIdAndUpdate(donation.product._id, {
        status: "donated",
        user: donation.donatedTo._id,
      });

      // Automatically reject other pending donations for this product
      await Donation.updateMany(
        { 
          product: donation.product._id, 
          status: 'pending',
          _id: { $ne: donationId }
        }, 
        { 
          status: 'rejected' 
        }
      );

      // Create notifications for rejected donations
      const rejectedDonations = await Donation.find({
        product: donation.product._id,
        status: 'rejected'
      });

      for (let rejectedDonation of rejectedDonations) {
        await NotificationModel.create({
          user: rejectedDonation.donatedTo,
          message: `La donation pour le produit "${donation.product.nom}" a été rejetée.`,
          type: "donation_rejected",
        });
      }
    }

    donation.status = status;
    await donation.save();

    // Créer une notification pour le demandeur
    const notificationMessage =
      status === "accepted"
        ? `Votre demande de don pour le produit "${donation.product.nom}" a été acceptée.`
        : `Votre demande de don pour le produit "${donation.product.nom}" a été rejetée.`;

    await NotificationModel.create({
      user: donation.donatedTo._id,
      message: notificationMessage,
      type: status === "accepted" ? "donation_accepted" : "donation_rejected",
    });

    res.status(200).json({
      message: `Donation ${status} avec succès.`,
      donation: donation.toObject(),
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la donation :", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la donation.",
      error: error.message,
    });
  }
};

// Annuler une donation en attente
exports.cancelDonation = async (req, res) => {
  const donationId = req.params.id;

  try {
    const donation = await Donation.findById(donationId).populate([
      "product",
      "donatedBy",
      "donatedTo",
    ]);

    if (!donation) {
      return res.status(404).json({ message: "Donation introuvable." });
    }

    // Seul le demandeur peut annuler sa propre demande
    if (donation.donatedTo._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à annuler cette donation." });
    }

    if (donation.status !== "pending") {
      return res.status(400).json({
        message: "Vous ne pouvez annuler que des donations en attente.",
      });
    }

    donation.status = "cancelled";
    await donation.save();

    // Notifier le propriétaire du produit
    await NotificationModel.create({
      user: donation.donatedBy._id,
      message: `La demande de donation pour le produit "${donation.product.nom}" a été annulée par le demandeur.`,
      type: "donation_cancelled",
    });

    res.status(200).json({
      message: "Donation annulée avec succès.",
      donation: donation.toObject(),
    });
  } catch (error) {
    console.error("Erreur lors de l'annulation de la donation :", error);
    res.status(500).json({
      message: "Erreur lors de l'annulation de la donation.",
      error: error.message,
    });
  }
};

exports.deleteAllDonations = async (req, res) => {
  try {
    // Suppression de toutes les donations
    await Donation.deleteMany({});
    res.status(200).json({ message: "Toutes les donations ont été supprimées avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression des donations :", error);
    res.status(500).json({
      message: "Erreur lors de la suppression des donations.",
      error: error.message,
    });
  }
};
exports.getDonationCount = async () => {
  try {
    // Count donations by status across all users
    const pendingCount = await Donation.countDocuments({ status: 'pending' });
    const acceptedCount = await Donation.countDocuments({ status: 'accepted' });
    const rejectedCount = await Donation.countDocuments({ status: 'rejected' });

    return {
      pendingCount,
      acceptedCount,
      rejectedCount,
      total: pendingCount + acceptedCount + rejectedCount
    };
  } catch (error) {
    throw new Error(`Failed to get donation counts: ${error.message}`);
  }
};


module.exports = exports;