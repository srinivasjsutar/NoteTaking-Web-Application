// src/Navbar.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; // Import the updated CSS for styling

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're on the notes page
  const isNotesPage = location.pathname === "/notes";

  const handleToggleRoute = () => {
    navigate(isNotesPage ? "/" : "/notes");
  };

  return (
    <nav className={`navbar ${isDarkMode ? "dark" : ""}`}>
      <div className="navbar-logo">
        <span className="logo-highlight">My</span> Notes
      </div>
      <div className="navbar-menu">
        <button
          className={`nav-btn ${isNotesPage ? "active" : ""}`}
          onClick={handleToggleRoute}
        >
          {isNotesPage ? "Write Note" : "Notes List"}
        </button>
        <button className="dark-mode-btn" onClick={toggleDarkMode}>
          {isDarkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
