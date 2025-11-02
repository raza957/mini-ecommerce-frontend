import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API from '../../api/config';
import './Cart.css';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`https://hopeful-clarity-production-3316.up.railway.app/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Cart items fetched:', response.data);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      alert('Failed to load cart items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      const response = await axios.put(`https://hopeful-clarity-production-3316.up.railway.app/cart/update/${itemId}`, {
        quantity: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Quantity updated:', response.data);
      
      // Update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
    setUpdating(false);
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;

    try {
      await axios.delete(`https://hopeful-clarity-production-3316.up.railway.app/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Item removed from cart');
      
      // Remove from local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;

    try {
      await axios.delete(`https://hopeful-clarity-production-3316.up.railway.app/cart/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Cart cleared');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };
const getImageUrl = (imageName) => {
    const BASE_URL = 'https://hopeful-clarity-production-3316.up.railway.app';
    if (!imageName) {
      return 'https://via.placeholder.com/300x200/cccccc/969696?text=No+Image';
    }
    return `${BASE_URL}/uploads/${imageName}`;
  };


  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Checkout functionality will be implemented soon!');
    // navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h2>Please Login</h2>
            <p>You need to be logged in to view your shopping cart.</p>
            <div className="empty-actions">
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <div className="empty-actions">
              <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Cart Items</h2>
              <button 
                onClick={clearCart}
                className="btn-clear-cart"
                disabled={updating}
              >
                {updating ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>

            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name}
                      onError={(e) => {
                        console.log('Image failed to load:', item.image);
                        e.target.src = 'https://via.placeholder.com/100x100/cccccc/969696?text=No+Image';
                      }}
                      onLoad={() => console.log('Image loaded successfully:', item.image)}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">
                      <Link to={`/product/${item.product_id}`}>{item.name}</Link>
                    </h3>
                    <p className="item-price">{`$${parseFloat(item.price).toFixed(2)}`}</p>
                    <p className="item-stock">{item.stock_quantity > 0 ? `${item.stock_quantity} in stock` : 'Out of stock'}</p>
                  </div>

                  <div className="item-quantity">
                    <label>Qty:</label>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock_quantity || updating}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <span className="total-amount">{`$${(parseFloat(item.price) * item.quantity).toFixed(2)}`}</span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      disabled={updating}
                      className="btn-remove"
                      title="Remove item"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>{`$${subtotal.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>{`$${tax.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>{`$${total.toFixed(2)}`}</span>
              </div>

              {subtotal < 50 && (
                <div className="shipping-notice">
                  <p>{`🎉 Add $${(50 - subtotal).toFixed(2)} more for FREE shipping!`}</p>
                </div>
              )}

              <div className="summary-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
               
                
                <Link to="/products" className="btn btn-secondary">
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="security-notice">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span>Secure checkout</span>
              </div>
              <div className="security-item">
                <span className="security-icon">↩</span>
                <span>30-day returns</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🚚</span>
                <span>Free shipping over $50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
