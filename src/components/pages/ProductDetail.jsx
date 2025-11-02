import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/config'; // ✅ centralized API config
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

  // ✅ Fetch single product
  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching product:', id);

      const response = await API.get(`/products/${id}`);
      console.log('✅ Product loaded:', response.data);

      setProduct(response.data);
      setError('');
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setError('Product not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add to Cart
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

      const response = await API.post(
        `/cart/add`,
        { productId: product.id, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('✅ Added to cart:', response.data);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('❌ Cart error:', error.response?.data || error.message);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  // ✅ Buy Now
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

  // ✅ Image URL Fix
  const getImageUrl = (imageName) => {
    if (!imageName || imageName === 'null' || imageName === 'undefined' || imageName === '') {
      return 'https://via.placeholder.com/600x400/cccccc/969696?text=No+Image';
    }

    // Remove `/api` from baseURL for direct static images
    const baseURL = API.defaults.baseURL.replace('/api', '');
    return `${baseURL}/uploads/${imageName}`;
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

  if (loading)
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );

  if (error)
    return (
      <div className="product-detail-error">
        <div className="error-icon">❌</div>
        <h3>{error}</h3>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="product-detail-error">
        <div className="error-icon">😞</div>
        <h3>Product not found</h3>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

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
                onError={(e) =>
                  (e.target.src =
                    'https://via.placeholder.com/600x400/cccccc/969696?text=Image+Not+Found')
                }
              />
              {discount > 0 && <div className="discount-badge">{discount}% OFF</div>}
              {product.featured && <div className="featured-badge">Featured</div>}
            </div>

            <div className="image-thumbnails">
              <div
                className={`thumbnail ${activeImage === 0 ? 'active' : ''}`}
                onClick={() => setActiveImage(0)}
              >
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  onError={(e) =>
                    (e.target.src =
                      'https://via.placeholder.com/100x100/cccccc/969696?text=No+Image')
                  }
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-rating">
                {'★★★★★'}
                <span className="rating-text">(4.8)</span>
              </div>
            </div>

            <div className="product-pricing">
              <div className="price-container">
                <span className="current-price">${product.price}</span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="original-price">${product.original_price}</span>
                    <span className="discount-text">
                      Save ${(product.original_price - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
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
                <span
                  className={`meta-value ${
                    product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'
                  }`}
                >
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} in stock`
                    : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity + Buttons */}
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        Math.max(1, parseInt(e.target.value) || 1),
                        product.stock_quantity
                      )
                    )
                  }
                />
                <button onClick={increaseQuantity} disabled={quantity >= product.stock_quantity}>
                  +
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button
                className={`btn btn-primary ${product.stock_quantity === 0 ? 'disabled' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                🛒 {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                className={`btn btn-secondary ${product.stock_quantity === 0 ? 'disabled' : ''}`}
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products-section">
          <h2>You Might Also Like</h2>
          <div className="related-products-grid">
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
