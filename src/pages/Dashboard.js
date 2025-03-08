import React from "react";
import { Link } from "react-router-dom";
import "../css/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>💰 Finance Dashboard</h1>
      
      <div className="button-container">
        <Link to="/tracker">
          <button className="dashboard-btn">📊 Go to Expense Tracker</button>
        </Link>
        <Link to="/income">
          <button className="dashboard-btn">💵 Go to Income Tracker</button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
