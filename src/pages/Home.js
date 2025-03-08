import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/home.css";

function Home() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [active, setActive] = useState(""); // Track hovered button

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""} ${active}`}>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1 className= 'head' >Welcome to Expense Tracker</h1>
      <p>Manage your expenses efficiently and track your spending.</p>

      <div className="home-links">
        <Link
          to="/login"
          className="btn login-btn"
          onMouseEnter={() => setActive("login-active")}
          onMouseLeave={() => setActive("")}
        >
          Login
        </Link>
        <Link
          to="/register"
          className="btn register-btn"
          onMouseEnter={() => setActive("register-active")}
          onMouseLeave={() => setActive("")}
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;
