import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

const API_URL = process.env.REACT_APP_BACKEND_URL; // ✅ Use Backend URL

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState(""); // Track focused input
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { username, password }); // ✅ Use API_URL
      localStorage.setItem("token", res.data.token);
      navigate("/tracker");
    } catch (error) {
      setError("Invalid Credentials ❌");
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <div className={`login-container ${focus}`}>
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocus("focus-username")}
              onBlur={() => setFocus("")}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocus("focus-password")}
              onBlur={() => setFocus("")}
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
