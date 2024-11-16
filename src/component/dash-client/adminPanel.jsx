import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import "../../CSS/AdminPanel.css";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/product/products", {
        params: { page, limit: 12 },
      });
      setProducts(response.data.products);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/product/delete/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      setToastMessage("Produit supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  const handleDeleteAllProducts = async () => {
    try {
      await axios.delete("http://localhost:5000/product/delete-all");
      setProducts([]);
      setToastMessage("Tous les produits ont été supprimés avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les produits :", error);
    }
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Notification Cleanup
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <div className="admin-panel-container">
      <h1>Admin Panel</h1>

      <button className="delete-all-button" onClick={handleDeleteAllProducts}>
        Supprimer tous les produits
      </button>

      <table className="admin-product-table">
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
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.nom}</td>
              <td>{product.description}</td>
              <td>{product.prix ? `${product.prix} Dt` : "N/A"}</td>
              <td>{product.categorie}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={pagination.currentPage === 1}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
        >
          Précédent
        </button>
        <span>
          Page {pagination.currentPage} sur {pagination.totalPages}
        </span>
        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
        >
          Suivant
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3 show">
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Fermer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
