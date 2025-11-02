import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../../api/config'; // ✅ centralized axios instance
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

  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // ✅ Fetch products and categories when filters change
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.featured) params.append('featured', filters.featured);

      const response = await API.get(`/products?${params.toString()}`);
      let filtered = response.data.products || [];

      // ✅ Price Range Filter
      if (filters.priceRange !== 'all') {
        filtered = filtered.filter(p => {
          switch (filters.priceRange) {
            case 'under25': return p.price < 25;
            case '25to50': return p.price >= 25 && p.price <= 50;
            case '50to100': return p.price > 50 && p.price <= 100;
            case 'over100': return p.price > 100;
            default: return true;
          }
        });
      }

      // ✅ Sorting
      filtered = sortProducts(filtered, filters.sort);

      setProducts(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  // ✅ Sorting Logic
  const sortProducts = (list, sortBy) => {
    const sorted = [...list];
    switch (sortBy) {
      case 'price-low': return sorted.sort((a, b) => a.price - b.price);
      case 'price-high': return sorted.sort((a, b) => b.price - a.price);
      case 'name': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest': return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default: return sorted;
    }
  };

  // ✅ Filter Change Handler
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all') params.set(k, v);
    });
    setSearchParams(params);
  };

  // ✅ Clear all filters
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

  // ✅ Pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (page) => setCurrentPage(page);

  const getActiveCategoryName = () => {
    if (!filters.category) return null;
    const cat = categories.find(c => c.id == filters.category);
    return cat ? cat.name : null;
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="products-page">
        <div className="container loading-section">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
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
            <h1>Our Products</h1>
            <p>Explore our amazing collection of {getActiveCategoryName() || 'products'}</p>
            <span className="products-count">{products.length} items found</span>
          </div>
        </div>

        <div className="products-content">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters-btn">Clear</button>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <h4>Categories</h4>
              <button
                className={!filters.category ? 'active' : ''}
                onClick={() => handleFilterChange('category', '')}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={filters.category == cat.id ? 'active' : ''}
                  onClick={() => handleFilterChange('category', cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <h4>Price Range</h4>
              {[
                { value: 'all', label: 'All Prices' },
                { value: 'under25', label: 'Under $25' },
                { value: '25to50', label: '$25 - $50' },
                { value: '50to100', label: '$50 - $100' },
                { value: 'over100', label: 'Over $100' }
              ].map(range => (
                <label key={range.value}>
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={filters.priceRange === range.value}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  {range.label}
                </label>
              ))}
            </div>

            {/* Featured */}
            <div className="filter-group">
              <h4>Featured</h4>
              <label>
                <input
                  type="checkbox"
                  checked={filters.featured === 'true'}
                  onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
                /> Featured only
              </label>
            </div>
          </aside>

          {/* Products Display */}
          <main className="products-main">
            <div className="products-toolbar">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div className="sort-filter">
                <label>Sort by:</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="no-products">
                <p>No products found. Try adjusting your filters.</p>
                <button onClick={clearFilters} className="btn btn-primary">Reset Filters</button>
              </div>
            ) : (
              <>
                <div className={`products-display ${viewMode}`}>
                  {currentProducts.map(p => (
                    <ProductCard key={p.id} product={p} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        className={currentPage === num ? 'active' : ''}
                        onClick={() => paginate(num)}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
