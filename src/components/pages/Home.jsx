import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/config'; // ✅ centralized API instance
import ProductCard from '../layout/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  // ✅ Use API instead of axios + hardcoded URL
  const fetchFeaturedProducts = async () => {
    try {
      const response = await API.get(`/products?featured=true&limit=6`);
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get(`/categories`);
      setCategories(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to MiniStore</h1>
            <p>Discover amazing products at great prices</p>
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/products?category=${category.id}`}
                className="category-card"
              >
                <div className="category-image">
                  <div className="category-icon">
                    {category.id === 1 ? '📱' : 
                     category.id === 2 ? '👕' : 
                     category.id === 3 ? '🏠' : '📚'}
                  </div>
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="btn btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
