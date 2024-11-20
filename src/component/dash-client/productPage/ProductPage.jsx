import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/ProductPage.css";
import LocationSearcher from "../LocationSearcher";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { debounce } from "lodash";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    subcategory: "",
    ville: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    userProducts: false
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxProductPrice, setMaxProductPrice] = useState(0);

  const token = Cookies.get("token");

  // Debounced fetch function
  const debouncedFetchProducts = useCallback(
    debounce(() => {
      fetchProducts();
    }, 500),
    []
  );

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const response = await axios.get("http://localhost:5000/product/max-price");
        const maxPrice = response.data.maxPrice || 0;
        setMaxProductPrice(maxPrice + 1);
      } catch (error) {
        console.error("Erreur lors de la récupération du prix maximum :", error);
      }
    };
    fetchMaxPrice();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage, selectedCategory]);

  // Sort and filter products by distance when user location changes
  useEffect(() => {
    if (userLocation && products.length > 0) {
      const productsWithDistance = products.map((product) => {
        if (!product.coordinates || product.coordinates.length !== 2) {
          return { ...product, distance: Infinity };
        }
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          product.coordinates[1],
          product.coordinates[0]
        );
        return { ...product, distance };
      });

      const filtered = productsWithDistance
        .filter((product) => product.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);

      setSortedProducts(filtered);
    } else {
      setSortedProducts(products);
    }
  }, [userLocation, products, maxDistance]);

  const fetchProducts = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 12,
        category: selectedCategory,
      };

      // Add filters conditionally
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      // Explicitly handle userProducts
      if (filters.userProducts !== undefined) {
        params.userProducts = filters.userProducts.toString();
      }

      const response = await axios.get(
        "http://localhost:5000/product/products",
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  const handleLocationSelect = (location) => {
    setUserLocation(location);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Produits</h2>

      {/* Location search section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Rechercher par proximité</h4>
          <button
            className="btn btn-primary"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? "Masquer la carte" : "Afficher la carte"}
          </button>
        </div>

        {showMap && (
          <div className="mb-4">
            <LocationSearcher
              onLocationSelect={handleLocationSelect}
              products={sortedProducts}
              maxDistance={maxDistance}
              showProductMarkers={true}
            />

            <div className="mt-3">
              <label htmlFor="maxDistance" className="form-label">
                Rayon de recherche: {maxDistance} km
              </label>
              <input
                type="range"
                className="form-range"
                id="maxDistance"
                min="1"
                max="400"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Filters */}
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        handleFilterChange={handleFilterChange}
        maxProductPrice={maxProductPrice}
      />

      {/* Products Grid */}
      <div className="row">
        {(userLocation ? sortedProducts : products).length > 0 ? (
          (userLocation ? sortedProducts : products).map((product) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              key={product._id}
            >
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              >
                <ProductCard
                  product={product}
                  distance={
                    product.distance
                      ? `${product.distance.toFixed(1)} km`
                      : undefined
                  }
                />
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center">
            {userLocation
              ? `Aucun produit trouvé dans un rayon de ${maxDistance} km`
              : "Aucun produit disponible."}
          </p>
        )}
      </div>

      {/* Pagination - only show when not using location search */}
      {!userLocation && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`btn ${
                currentPage === index + 1
                  ? "btn-primary"
                  : "btn-outline-primary"
              } mx-1`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;