import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-hero">
          <h1>About MiniStore</h1>
          <p className="subtitle">Your trusted online shopping destination</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              Welcome to MiniStore, your number one source for all products. 
              We're dedicated to giving you the very best of products, with a focus on 
              quality, customer service, and uniqueness.
            </p>
            <p>
              Founded in 2024, MiniStore has come a long way from its beginnings. 
              When we first started out, our passion for providing the best equipment 
              for our customers drove us to do intense research, and gave us the 
              impetus to turn hard work and inspiration into a booming online store.
            </p>
          </div>

          <div className="about-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚚</div>
                <h3>Fast Delivery</h3>
                <p>Quick and reliable shipping to your doorstep</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⭐</div>
                <h3>Quality Products</h3>
                <p>Carefully curated items from trusted suppliers</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h3>Best Prices</h3>
                <p>Competitive pricing without compromising quality</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure Shopping</h3>
                <p>Your data and payments are always protected</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              Our mission is to make online shopping accessible, enjoyable, and affordable 
              for everyone. We believe that everyone deserves access to quality products 
              at reasonable prices, delivered with excellent customer service.
            </p>
          </div>

          <div className="about-section">
            <h2>Why Choose Us?</h2>
            <div className="why-choose-us">
              <div className="reason">
                <h4>Wide Selection</h4>
                <p>From electronics to home goods, we have it all</p>
              </div>
              
              <div className="reason">
                <h4>24/7 Support</h4>
                <p>Our customer service team is always here to help</p>
              </div>
              
              <div className="reason">
                <h4>Easy Returns</h4>
                <p>30-day return policy for your peace of mind</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;