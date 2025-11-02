import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left - Connect / Social Column + Copyright */}
        <div className="footer-left">
          <h4>Connect</h4>
          <div className="social-column">
            <a
              href="https://www.linkedin.com/in/raza-ali-53430a2a5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">💼</span> LinkedIn
            </a>
            <a
              href="https://www.instagram.com/raza_abbasi.1/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">📷</span> Instagram
            </a>
            <a
              href="https://github.com/raza957"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">💻</span> GitHub
            </a>
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            &copy; {currentYear} MiniStore. All Rights Reserved.
          </div>
        </div>

        {/* Center - Quick Links */}
        <div className="footer-center">
          <h4>Quick Links</h4>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Right - Contact Info */}
        <div className="footer-right">
          <h4>Contact</h4>
          <p>📧 razakhan25032004@gmail.com</p>
          <p>📱 +971 56 284 6334</p>
          <p>📍 Dubai, UAE</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
