import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import NouveauOffreF from "./newOffer/NouveauOffreF";
import axios from "axios";
import "../../CSS/MyOffer.css";
import Cookies from "js-cookie";

const Offer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [offers, setOffers] = useState([]);
  const token = Cookies.get("token");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });
  const [productToEdit, setProductToEdit] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOffers = async (page = 1) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("Aucun identifiant utilisateur trouvé dans localStorage");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/product/user/products?userId=${userId}&page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data;

      setOffers(data.products);
      setPagination({
        currentPage: parseInt(data.currentPage),
        totalPages: data.totalPages,
        totalProducts: data.totalProducts,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  const handleDeleteClick = (offerId) => {
    setSelectedOfferId(offerId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `http://localhost:5000/product/delete/${selectedOfferId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setOffers(offers.filter((offer) => offer._id !== selectedOfferId));
        setToastMessage("Offre supprimée avec succès !"); // Afficher une notification de succès
      } else {
        console.error("Erreur :", response.data.msg);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de produit :", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedOfferId(null);
    }
  };

  const handleEditClick = (offer) => {
    setProductToEdit(offer);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Nettoyage du timeout pour la notification
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 5000); // Cacher la notification après 5 secondes
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const DeleteConfirmationModal = () => (
    <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
      <div className="confirmation-modal">
        <h2>Confirmer la suppression</h2>
        <p>
          Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est
          irréversible.
        </p>
        <div className="confirmation-modal-buttons">
          <button
            className="offer-confirm-button"
            onClick={handleDeleteConfirm}
          >
            Supprimer
          </button>
          <button
            className="offer-cancel-button"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Annuler
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      <div className="my-offer-containerrs">
        <div className="main1-content">
          <button
            className="add-offer-button"
            onClick={() => setIsModalOpen(true)}
          >
            Partager un nouveau produit
          </button>

          <div className="crud-table">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Prix</th>
                  <th>Catégorie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer._id}>
                    <td>{offer.nom}</td>
                    <td>{offer.description}</td>
                    <td>{offer.prix ? `${offer.prix} TND` : "N/A"}</td>
                    <td>{offer.categorie}</td>
                    <td>
                      <button
                        className="offer-edit-button"
                        onClick={() => handleEditClick(offer)}
                      >
                        Modifier
                      </button>
                      <button
                        className="offer-delete-button"
                        onClick={() => handleDeleteClick(offer._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => fetchOffers(pagination.currentPage - 1)}
              >
                Précédent
              </button>
              <span>
                Page {pagination.currentPage} sur {pagination.totalPages}
              </span>
              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => fetchOffers(pagination.currentPage + 1)}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div
          className="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3 show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="toast"
              aria-label="Fermer"
            />
          </div>
        </div>
      )}

      {/* Modal pour Nouvelle Offre */}
      <Modal show={isModalOpen} onClose={handleModalClose}>
        <NouveauOffreF
          handleModalClose={handleModalClose}
          productToEdit={productToEdit}
          onClose={handleModalClose}
          setToastMessage={setToastMessage}
          fetchOffers={fetchOffers}
        />
      </Modal>

      <DeleteConfirmationModal />
    </>
  );
};

export default Offer;
