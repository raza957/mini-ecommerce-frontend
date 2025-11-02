import React from 'react';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <div className="container">
        <div className="privacy-hero">
          <h1>Privacy Policy</h1>
          <p>Last updated: October 2025</p>
        </div>

        <div className="privacy-content">
          <div className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you use our services, 
              including when you create an account, make a purchase, or contact us for support.
            </p>
            
            <h3>Personal Information</h3>
            <ul>
              <li>Name and contact details (email address, phone number)</li>
              <li>Account credentials (username and password)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Shipping address and order history</li>
              <li>Communications and feedback</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Provide and maintain our services</li>
              <li>Communicate with you about products, services, and promotions</li>
              <li>Personalize your shopping experience</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell your personal information to third parties. We may share 
              your information in the following circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> With trusted third parties who assist 
                us in operating our website, processing payments, and delivering products
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect 
                our rights and the rights of others
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, 
                acquisition, or sale of all or a portion of our assets
              </li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures 
              to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission 
              over the Internet or electronic storage is 100% secure.
            </p>
          </div>

          <div className="privacy-section">
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Withdraw consent at any time</li>
              <li>Data portability</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information 
              provided in the Contact section.
            </p>
          </div>

          <div className="privacy-section">
            <h2>6. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your browsing 
              experience, analyze site traffic, and personalize content. You can 
              control cookies through your browser settings.
            </p>
          </div>

          <div className="privacy-section">
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify 
              you of any changes by posting the new policy on this page and updating 
              the "Last updated" date.
            </p>
          </div>

          <div className="privacy-section">
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data 
              practices, please contact us:
            </p>
            <div className="contact-details">
              <p>📧 Email: razakhan25032004@gmail.com</p>
              <p>📞 Phone: +971562846334</p>
              <p>📍 Address: Muhasinah, 19A Street, Dubai, UAE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;