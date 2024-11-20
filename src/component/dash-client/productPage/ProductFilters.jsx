import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import categories from "../../../data/categories";
import "./css/ProductFilter.css";

const ProductFilters = ({
  filters,
  setFilters,
  selectedCategory,
  handleCategoryChange,
  handleFilterChange,
  maxProductPrice,
}) => {
  const [priceRange, setPriceRange] = useState([0, maxProductPrice]);

  // Update slider when max product price changes
  useEffect(() => {
    setPriceRange([0, maxProductPrice]);
  }, [maxProductPrice]);

  // Synchronize input changes with slider
  const handleMinPriceChange = (value) => {
    const numValue = Math.max(0, Math.min(Number(value), priceRange[1]));
    setPriceRange([numValue, priceRange[1]]);
    
    setFilters((prev) => ({
      ...prev,
      minPrice: numValue.toString(),
    }));
  };

  const handleMaxPriceChange = (value) => {
    const numValue = Math.max(priceRange[0], Math.min(Number(value), maxProductPrice));
    setPriceRange([priceRange[0], numValue]);
    
    setFilters((prev) => ({
      ...prev,
      maxPrice: numValue.toString(),
    }));
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);

    setFilters((prev) => ({
      ...prev,
      minPrice: newRange[0].toString(),
      maxPrice: newRange[1].toString(),
    }));
  };

  return (
    <div className="product-filter-container">
      <div className="product-filters mb-4 d-flex justify-content-between align-items-center">
        {/* Search Input and Category Filter */}
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          <select
            className="form-select me-2"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category, index) => (
              <React.Fragment key={index}>
                <option disabled className="font-weight-bold text-muted">
                  {category.name}
                </option>
                {category.subcategories.map((sub) => (
                  <option key={sub} value={sub} className="pl-3">
                    {sub}
                  </option>
                ))}
              </React.Fragment>
            ))}
          </select>
        </div>

        {/* Status and Price Filters */}
        <div className="d-flex align-items-center">
          <select
            className="form-select me-2"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="vente">Vente</option>
            <option value="echange">Echange</option>
            <option value="don">Don</option>
          </select>

          <div className="d-flex align-items-center">
            <div className="range-container">
              <div className="filter-inputs-range">
                <div className="filter-inputs">
                  <div>
                    <label>Min Price</label>
                    <input
                      className="form-control me-2"
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handleMinPriceChange(e.target.value)}
                      min="0"
                      max={priceRange[1]}
                    />
                  </div>
                  <div>
                    <label>Max Price</label>
                    <input
                      type="number"
                      className="form-control me-2"
                      value={priceRange[1]}
                      onChange={(e) => handleMaxPriceChange(e.target.value)}
                      min={priceRange[0]}
                      max={maxProductPrice}
                    />
                  </div>
                </div>
                <Slider
                  range
                  min={0}
                  max={maxProductPrice}
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  className="filter-price-slider"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="userProductsFilter"
          checked={filters.userProducts}
          onChange={(e) => handleFilterChange("userProducts", e.target.checked)}
        />
        <label className="form-check-label" htmlFor="userProductsFilter">
          Afficher mes produits
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;