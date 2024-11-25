import React, { useState, useEffect } from "react";
import "../../CSS/SellerHistory.css";
import Cookies from "js-cookie";

const SellerHistory = () => {
  const [orders, setOrders] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    paymentStatus: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });

  const id = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  const token = Cookies.get("token");

  const updatePaymentStatus = async (transactionId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/transactions/${transactionId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: 'completed' })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment status");
      }

      // Refresh orders after update
      fetchData("orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (type) => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      const url = `http://localhost:5000/transactions/${id}/${type}?${query.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Échec de la récupération des données");
      }

      const data = await response.json();
      if (type === "orders") {
        // Filter orders only for 'fournisseur' role
        const filteredOrders = role === 'fournisseur' 
          ? data.orders.filter(order => order.status !== 'completed')
          : data.orders;
        setOrders(filteredOrders || []);
      } else if (type === "purchases") {
        setPurchases(data.purchases || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("orders");
    fetchData("purchases");
  }, [filters, role]);

  const formatStatus = (status) => {
    const statusMap = {
      pending: 'En attente',
      completed: 'Terminé',
      processing: 'En cours'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'en attente': 'status-pending',
      'terminé': 'status-completed',
      'en cours': 'status-processing',
      'failed': 'status-failed'
    };
    return statusMap[status.toLowerCase()] || '';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const renderTable = (data, type) => (
    <div className="table-container">
      <h3 className="table-title">
        {type === "orders" ? "Commandes à traiter" : "Historique des achats"}
      </h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            {type === "orders" && <th>Acheteur</th>}
            <th>Produits</th>
            <th>Total</th>
            <th>Méthode de paiement</th>
            <th>Statut</th>
            {type === "orders" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => {
              const status = item.paymentMethod === 'online' 
                ? formatStatus(item.paymentStatus)
                : formatStatus(item.paymentStatus);
              
              return (
                <tr key={item._id}>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  {type === "orders" && (
                    <td>{item.buyer?.name || 'N/A'}</td>
                  )}
                  <td>
                    <div className="product-list">
                      {item.products.map((prod, idx) => (
                        <div key={idx} className="product-item">
                          {prod.product.nom} x {prod.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{formatPrice(item.totalAmount)}</td>
                  <td>{item.paymentMethod}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(status)}`}>
                      {status}
                    </span>
                  </td>
                  {type === "orders" && (
                    <td>
                      {item.paymentStatus === 'pending' && (
                        <button 
                          onClick={() => updatePaymentStatus(item._id)}
                          className="update-status-btn"
                          disabled={loading}
                        >
                          Marquer comme payé
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={type === "orders" ? 7 : 6} className="no-data">
                Aucune donnée disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Statut :</label>
            <select
              name="status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            >
              <option value="">Tous</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date de début :</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Date de fin :</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Page :</label>
            <input
              type="number"
              name="page"
              min="1"
              value={filters.page}
              onChange={(e) => setFilters({ ...filters, page: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>

      {loading && <div className="loading">Chargement...</div>}
      {error && <div className="error">{error}</div>}

      {role === "fournisseur" && renderTable(orders, "orders")}
      {renderTable(purchases, "purchases")}
    </div>
  );
};

export default SellerHistory;