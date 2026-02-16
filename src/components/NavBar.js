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
            <a href="#events">Events</a>
            <Link to="/team">Our Team</Link>
            <a href="#team">Leads</a>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu">
            <a href="#events" onClick={() => setIsOpen(false)}>Events</a>
            <a href="#team" onClick={() => setIsOpen(false)}>Leads</a>
            <a href="#aim" onClick={() => setIsOpen(false)}>Aim</a>
            <Link to="/team" onClick={() => setIsOpen(false)}>Our Team</Link>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
