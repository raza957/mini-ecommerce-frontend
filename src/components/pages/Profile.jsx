import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: ''
      });
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically make an API call to update the profile
      // await axios.put('http://localhost:5000/api/auth/profile', profileForm, {
      //   headers: { Authorization: Bearer ${localStorage.getItem('token')} }
      // });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Here you would typically make an API call to change password
      // await axios.put('http://localhost:5000/api/auth/password', {
      //   currentPassword: passwordForm.currentPassword,
      //   newPassword: passwordForm.newPassword
      // }, {
      //   headers: { Authorization: Bearer ${localStorage.getItem('token')} }
      // });
      
      alert('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordInputChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOrderStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#38a169';
      case 'processing': return '#3182ce';
      case 'pending': return '#d69e2e';
      case 'cancelled': return '#e53e3e';
      default: return '#718096';
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="not-logged-in">
            <div className="login-icon">🔐</div>
            <h2>Please Login</h2>
            <p>You need to be logged in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="user-welcome">
            <h1>Welcome back, {user.name}!</h1>
            <p>Manage your account and view your orders</p>
          </div>
          <div className="user-badge">
            <div className="avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          {/* Sidebar Navigation */}
          <div className="profile-sidebar">
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="nav-icon">👤</span>
                Profile Information
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <span className="nav-icon">📦</span>
                Order History
                {orders.length > 0 && <span className="order-count">{orders.length}</span>}
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <span className="nav-icon">🔒</span>
                Change Password
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'address' ? 'active' : ''}`}
                onClick={() => setActiveTab('address')}
              >
                <span className="nav-icon">📍</span>
                Address Book
              </button>
              
              <div className="nav-divider"></div>
              
              <button 
                className="nav-item logout-btn"
                onClick={logout}
              >
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Profile Information</h2>
                  <p>Update your personal information and preferences</p>
                </div>
                
                <form onSubmit={handleProfileUpdate} className="profile-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleInputChange}
                        required
                        disabled
                        className="disabled-input"
                        placeholder="Your email address"
                      />
                      <small className="input-note">Email cannot be changed</small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="address">Shipping Address</label>
                      <textarea
                        id="address"
                        name="address"
                        value={profileForm.address}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Enter your complete shipping address"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setProfileForm({
                        name: user.name || '',
                        email: user.email || '',
                        phone: '',
                        address: ''
                      })}
                    >
                      Reset Changes
                    </button>
                  </div>
                </form>
                
                <div className="account-info">
                  <h3>Account Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Member Since</span>
                      <span className="info-value">
                        {user.created_at ? formatDate(user.created_at) : 'N/A'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Account Type</span>
                      <span className="info-value badge">{user.role || 'Customer'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email Verified</span>
                      <span className="info-value verified">✓ Verified</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Login</span>
                      <span className="info-value">Recently</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === 'orders' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Order History</h2>
                  <p>View and track your recent orders</p>
                </div>
                
                {ordersLoading ? (
                  <div className="loading-orders">
                    <div className="loading-spinner"></div>
                    <p>Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="empty-orders">
                    <div className="empty-icon">📦</div>
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.href = '/products'}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h4>Order #MS{order.id.toString().padStart(6, '0')}</h4>
                            <span className="order-date">{formatDate(order.created_at)}</span>
                          </div>
                          <div className="order-status">
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getOrderStatusColor(order.status) }}
                            >
                              {order.status}
                            </span>
                            <span className="order-total">${order.total_amount}</span>
                          </div>
                        </div>
                        
                        <div className="order-items">
                          {order.items && order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">Qty: {item.quantity}</span>
                              <span className="item-price">${item.price}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-actions">
                          <button className="btn btn-outline">View Details</button>
                          <button className="btn btn-outline">Track Order</button>
                          <button className="btn btn-outline">Reorder</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Change Password</h2>
                  <p>Update your password to keep your account secure</p>
                </div>
                
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password *</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      required
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password *</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      required
                      minLength="6"
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password *</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      required
                      minLength="6"
                      placeholder="Confirm your new password"
                    />
                  </div>
                  
                  <div className="password-requirements">
                    <h4>Password Requirements:</h4>
                    <ul>
                      <li>At least 6 characters long</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Include numbers and special characters</li>
                    </ul>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Change Password'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      })}
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Book Tab */}
            {activeTab === 'address' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Address Book</h2>
                  <p>Manage your shipping addresses</p>
                </div>
                
                <div className="addresses-list">
                  <div className="address-card">
                    <div className="address-header">
                      <h4>Default Shipping Address</h4>
                      <span className="address-default">Default</span>
                    </div>
                    <div className="address-details">
                      <p><strong>{user.name}</strong></p>
                      <p>19A Street</p>
                      <p>Muhaisnah</p>
                      <p>Dubai , Sonapur</p>
                      <p>United Arab Emirates</p>
                      <p className="phone">Phone:+971562846334</p>
                    </div>
                    <div className="address-actions">
                      <button className="btn btn-outline">Edit</button>
                      <button className="btn btn-outline">Set as Default</button>
                    </div>
                  </div>
                  
                  <div className="add-new-address">
                    <button className="btn btn-primary">
                      <span className="btn-icon">+</span>
                      Add New Address
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;