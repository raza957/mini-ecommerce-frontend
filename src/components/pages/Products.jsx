import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../layout/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    featured: searchParams.get('featured') || '',
    sort: searchParams.get('sort') || 'newest',
    priceRange: searchParams.get('priceRange') || 'all'
  });

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.featured) params.append('featured', filters.featured);
      
      const response = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
      
      // Apply client-side sorting and filtering
      let filteredProducts = response.data.products;
      
      // Apply price range filter
      if (filters.priceRange !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
          switch (filters.priceRange) {
            case 'under25': return product.price < 25;
            case '25to50': return product.price >= 25 && product.price <= 50;
            case '50to100': return product.price > 50 && product.price <= 100;
            case 'over100': return product.price > 100;
            default: return true;
          }
        });
      }
      
      // Apply sorting
      filteredProducts = sortProducts(filteredProducts, filters.sort);
      
      setProducts(filteredProducts);
      setCurrentPage(1); // Reset to first page when filters change
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return sorted;
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL parameters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all') params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ 
      category: '', 
      search: '', 
      featured: '', 
      sort: 'newest', 
      priceRange: 'all' 
    });
    setSearchParams({});
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getActiveCategoryName = () => {
    if (!filters.category) return null;
    const category = categories.find(cat => cat.id == filters.category);
    return category ? category.name : null;
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="loading-products">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Header with Breadcrumb */}
        <div className="page-header">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span>Products</span>
            {getActiveCategoryName() && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{getActiveCategoryName()}</span>
              </>
            )}
          </nav>
          
          <div className="header-content">
            <div className="header-text">
              <h1>Our Products</h1>
              <p>Discover our amazing collection of {getActiveCategoryName() ? getActiveCategoryName().toLowerCase() : 'products'}</p>
            </div>
            <div className="header-stats">
              <span className="products-count">{products.length} products found</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="products-content">
          {/* Sidebar Filters */}
          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All
              </button>
            </div>

            {/* Categories Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Categories</h4>
              <div className="category-filters">
                <button
                  className={`category-filter ${!filters.category ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', '')}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-filter ${filters.category == category.id ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', category.id)}
                  >
                    {category.name}
                    <span className="category-count">
                      {/* You can add product counts per category here */}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Price Range</h4>
              <div className="price-filters">
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: 'under25', label: 'Under $25' },
                  { value: '25to50', label: '$25 - $50' },
                  { value: '50to100', label: '$50 - $100' },
                  { value: 'over100', label: 'Over $100' }
                ].map(range => (
                  <label key={range.value} className="price-filter">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    />
                    <span className="checkmark"></span>
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Featured Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Product Type</h4>
              <div className="featured-filter">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.featured === 'true'}
                    onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
                  />
                  <span className="checkmark"></span>
                  Featured Products Only
                </label>
              </div>
            </div>

            {/* Quick Links */}
            <div className="filter-group">
              <h4 className="filter-title">Quick Links</h4>
              <div className="quick-links">
                <Link to="/products?featured=true" className="quick-link">
                  🔥 Featured Items
                </Link>
                <Link to="/products?category=1" className="quick-link">
                  📱 Electronics
                </Link>
                <Link to="/products?category=2" className="quick-link">
                  👕 Fashion
                </Link>
                <Link to="/products?category=3" className="quick-link">
                  🏠 Home & Kitchen
                </Link>
                <Link to="/products?category=4" className="quick-link">
                  📚 Books
                </Link>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="products-main">
            {/* Products Toolbar */}
            <div className="products-toolbar">
              <div className="toolbar-left">
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    ▦
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    ☰
                  </button>
                </div>
                
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>

              <div className="toolbar-right">
                <div className="sort-filter">
                  <label>Sort by:</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="sort-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category || filters.search || filters.featured || filters.priceRange !== 'all') && (
              <div className="active-filters">
                <span className="active-filters-label">Active filters:</span>
                {filters.category && (
                  <span className="active-filter">
                    Category: {getActiveCategoryName()}
                    <button onClick={() => handleFilterChange('category', '')}>×</button>
                  </span>
                )}
                {filters.search && (
                  <span className="active-filter">
                    Search: "{filters.search}"
                    <button onClick={() => handleFilterChange('search', '')}>×</button>
                  </span>
                )}
                {filters.featured && (
                  <span className="active-filter">
                    Featured Only
                    <button onClick={() => handleFilterChange('featured', '')}>×</button>
                  </span>
                )}
                {filters.priceRange !== 'all' && (
                  <span className="active-filter">
                    Price: {
                      filters.priceRange === 'under25' ? 'Under $25' :
                      filters.priceRange === '25to50' ? '$25 - $50' :
                      filters.priceRange === '50to100' ? '$50 - $100' : 'Over $100'
                    }
                    <button onClick={() => handleFilterChange('priceRange', 'all')}>×</button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {products.length === 0 ? (
              <div className="no-products">
                <div className="no-products-icon">😞</div>
                <h3>No products found</h3>
                <p>Try adjusting your search filters or browse different categories</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`products-display ${viewMode}`}>
                  {currentProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      ← Previous
                    </button>
                    
                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;