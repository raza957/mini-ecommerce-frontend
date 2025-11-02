import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();

  // Add to cart handler
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add`,
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const getImageUrl = (imageName) => {
  if (!imageName)
    return 'https://via.placeholder.com/300x200/cccccc/969696?text=No+Image';
  return `${process.env.REACT_APP_API_URL}/uploads/${imageName}`;
};



  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            onError={(e) => {
              e.target.src =
                'https://via.placeholder.com/300x200/cccccc/969696?text=No+Image';
            }}
          />
          {product.featured && <span className="featured-badge">Featured</span>}
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="product-description">
            {product.description
              ? product.description.substring(0, 80) + '...'
              : 'No description available'}
          </p>
          <div className="price-section">
            <span className="current-price">${product.price}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="original-price">${product.original_price}</span>
            )}
          </div>
          <div className="product-meta">
            <span className="category">{product.category_name || 'Uncategorized'}</span>
            <span
              className={`stock ${
                product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'
              }`}
            >
              {product.stock_quantity > 0
                ? `${product.stock_quantity} in stock`
                : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>

      <div className="product-actions">
        <button
          className={`btn add-to-cart-btn ${
            product.stock_quantity === 0 ? 'disabled' : ''
          }`}
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>

        <Link to={`/product/${product.id}`} className="btn view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
