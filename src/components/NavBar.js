import React, { useState } from 'react';
import './Navbar.css';
import { Menu, X } from 'lucide-react';
import logo from '../images/logo.png';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-content">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-menu">
            <Link to="/events">Events</Link>
            <Link to="/team">Our Team</Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu">
            <Link to="/events" onClick={() => setIsOpen(false)}>Events</Link>
            <Link to="/team" onClick={() => setIsOpen(false)}>Our Team</Link>
            <a href="/#aim" onClick={() => setIsOpen(false)}>Aim</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
