import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/config'; // centralized axios instance
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/profile', profileForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile.');
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        '/auth/password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password.');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page container">
      <h1>My Profile</h1>

      {/* Profile Info Form */}
      <section className="profile-section">
        <h2>Profile Information</h2>
        <form onSubmit={updateProfile} className="profile-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </section>

      {/* Change Password Form */}
      <section className="profile-section">
        <h2>Change Password</h2>
        <form onSubmit={updatePassword} className="profile-form">
          <label>
            Current Password:
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <button type="submit" className="btn btn-secondary">
            Change Password
          </button>
        </form>
      </section>

      {/* Order History */}
      <section className="profile-section">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <h3>Order #{order.id}</h3>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> ${order.total}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
