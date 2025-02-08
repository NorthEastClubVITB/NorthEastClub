import React from "react";
import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import "./footer.css"; // Import CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Social Links */}
        <div>
          <a href="https://www.linkedin.com/company/north-east-club-vitb/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={24} />
          </a>
          <a href="https://www.instagram.com/northeastclub.vitb_/" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={24} />
          </a>
        </div>

        {/* Contact Section */}
        <div className="contact-info">
          <p>
            Contact us: <FaEnvelope className="inline-block" /> northeast.club.vitb@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
