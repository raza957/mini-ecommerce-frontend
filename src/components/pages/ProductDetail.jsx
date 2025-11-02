import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching product with ID:', id);
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      console.log('✅ Product data received:', response.data);
      setProduct(response.data);
      setError('');
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      setError('Product not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.stock_quantity < quantity) {
      alert('Not enough stock available');
      return;
    }

    try {
      console.log('🛒 Adding to cart:', { productId: product.id, quantity });
      
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        productId: product.id,
        quantity: quantity
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('✅ Add to cart response:', response.data);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      console.error('📝 Error details:', error.response?.data);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      alert('Please login to purchase items');
      navigate('/login');
      return;
    }

    try {
      await handleAddToCart();
      navigate('/cart');
    } catch (error) {
      console.error('❌ Error in buy now:', error);
    }
  };

  // ✅ FIXED: Correct Image URL Function
  const getImageUrl = (imageName) => {
    console.log('🖼 Getting image URL for:', imageName);
    
    if (!imageName || imageName === 'null' || imageName === 'undefined' || imageName === '') {
      console.log('📛 No image found, using placeholder');
      return 'https://via.placeholder.com/600x400/cccccc/969696?text=No+Image';
    }
    
    // ✅ CORRECT: Direct uploads folder se image serve karo
    const imageUrl = `http://localhost:5000/uploads/${imageName}`;
    console.log('✅ Image URL:', imageUrl);
    return imageUrl;
  };

  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-error">
        <div className="error-icon">❌</div>
        <h3>{error}</h3>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <div className="error-icon">😞</div>
        <h3>Product not found</h3>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const discount = product.original_price ? 
    Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/products">Products</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images-section">
            <div className="main-image">
              <img 
                src={getImageUrl(product.image)} 
                alt={product.name}
                onError={(e) => {
                  console.log('❌ Main image failed to load:', product.image);
                  e.target.src = 'https://via.placeholder.com/600x400/cccccc/969696?text=Image+Not+Found';
                }}
                onLoad={() => console.log('✅ Main image loaded successfully:', product.image)}
              />
              {discount > 0 && (
                <div className="discount-badge">
                  {discount}% OFF
                </div>
              )}
              {product.featured && (
                <div className="featured-badge">
                  Featured
                </div>
              )}
            </div>
            
            {/* Additional images can be added here */}
            <div className="image-thumbnails">
              <div 
                className={`thumbnail ${activeImage === 0 ? 'active' : ''}`}
                onClick={() => setActiveImage(0)}
              >
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name}
                  onError={(e) => {
                    console.log('❌ Thumbnail image failed to load:', product.image);
                    e.target.src = 'https://via.placeholder.com/100x100/cccccc/969696?text=No+Image';
                  }}
                  onLoad={() => console.log('✅ Thumbnail image loaded successfully:', product.image)}
                />
              </div>
              {/* You can map through product.images array if available */}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {'★★★★★'.slice(0, 5)}
                  <span className="rating-text">(4.8)</span>
                </div>
                <span className="reviews">128 Reviews</span>
              </div>
            </div>

            <div className="product-pricing">
              <div className="price-container">
                <span className="current-price">${product.price}</span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="original-price">${product.original_price}</span>
                    <span className="discount-text">Save ${(product.original_price - product.price).toFixed(2)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available for this product.'}</p>
            </div>

            <div className="product-meta-info">
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category_name || 'Uncategorized'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">SKU:</span>
                <span className="meta-value">MS{product.id.toString().padStart(4, '0')}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Availability:</span>
                <span className={`meta-value ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  type="button" 
                  className="quantity-btn"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  className="quantity-input"
                  value={quantity}
                  min="1"
                  max={product.stock_quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= product.stock_quantity) {
                      setQuantity(value);
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="quantity-btn"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className={`btn btn-primary btn-add-to-cart ${product.stock_quantity === 0 ? 'disabled' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <span className="btn-icon">🛒</span>
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button 
                className={`btn btn-secondary btn-buy-now ${product.stock_quantity === 0 ? 'disabled' : ''}`}
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
              >
                <span className="btn-icon">⚡</span>
                Buy Now
              </button>
            </div>

            {/* Additional Features */}
            <div className="product-features">
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <div className="feature-text">
                  <strong>Free Shipping</strong>
                  <span>On orders over $50</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">↩</span>
                <div className="feature-text">
                  <strong>30-Day Returns</strong>
                  <span>Money back guarantee</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <div className="feature-text">
                  <strong>Secure Payment</strong>
                  <span>100% protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="related-products-section">
          <h2>You Might Also Like</h2>
          <div className="related-products-grid">
            {/* You can fetch and display related products here */}
            <div className="related-product-placeholder">
              <p>Related products will be displayed here</p>
              <Link to="/products" className="btn btn-outline">
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;