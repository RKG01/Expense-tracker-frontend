import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExpenseTracker from "./pages/ExpenseTracker";
import IncomeTracker from "./pages/IncomeTracker";
import Dashboard from "./pages/Dashboard";
import "./App.css";

// Backend API Base URL (Render Deployment)
const API_URL = process.env.REACT_APP_BACKEND_URL; 

export const BackendContext = React.createContext(API_URL);


function App() {
  return (
    <BackendContext.Provider value={API_URL}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tracker" element={<ExpenseTracker />} />
          <Route path="/income" element={<IncomeTracker />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </BackendContext.Provider>
  );
}

export default App;
