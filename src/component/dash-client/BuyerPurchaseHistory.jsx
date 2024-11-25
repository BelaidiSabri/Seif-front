import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../../CSS/BuyerPurchaseHistory.css"


const BuyerPurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("token");
  const id = localStorage.getItem('userId')


  // Pagination and filters state
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
    sort: "-createdAt",
    seller: "",
    minAmount: "",
    maxAmount: "",
  });

  const fetchPurchaseHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      }).toString();

      const response = await axios.get(
        `http://localhost:5000/transactions/${id}/purchases?${queryParams}`
      );

      setPurchases(response.data.purchases);
      setAnalytics(response.data.analytics);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch purchase history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePagination = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="buyer-purchase-history">
      <h2>Purchase History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {/* Filters */}
          <div className="filters">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              placeholder="Start Date"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              placeholder="End Date"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="number"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              placeholder="Min Amount"
            />
            <input
              type="number"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              placeholder="Max Amount"
            />
            <input
              type="text"
              name="seller"
              value={filters.seller}
              onChange={handleFilterChange}
              placeholder="Seller ID"
            />
            <button onClick={fetchPurchaseHistory}>Apply Filters</button>
          </div>

          {/* Analytics */}
          {analytics && (
            <div className="analytics">
              <h3>Analytics</h3>
              <p>Total Purchases: {analytics.totalPurchases}</p>
              <p>Total Spent: ${analytics.totalSpent}</p>
              <p>Average Order Value: ${analytics.averageOrderValue}</p>
              <p>Total Items Purchased: {analytics.totalItems}</p>
            </div>
          )}

          {/* Purchases */}
          <div className="purchases">
            <h3>Purchases</h3>
            {purchases.length > 0 ? (
              purchases.map((purchase) => (
                <div key={purchase._id} className="purchase">
                  <p>Order ID: {purchase._id}</p>
                  <p>Date: {new Date(purchase.createdAt).toLocaleDateString()}</p>
                  <p>Total Amount: ${purchase.totalAmount}</p>
                  <p>Status: {purchase.status}</p>
                  <ul>
                    {purchase.products.map((product) => (
                      <li key={product._id}>
                        {product.product.nom} - ${product.product.prix} x{" "}
                        {product.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No purchases found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={filters.page === 1}
              onClick={() => handlePagination(filters.page - 1)}
            >
              Previous
            </button>
            <span>Page {filters.page}</span>
            <button
              disabled={purchases.length < filters.limit}
              onClick={() => handlePagination(filters.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerPurchaseHistory;
