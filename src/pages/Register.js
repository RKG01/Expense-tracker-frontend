import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/reg.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bubbles, setBubbles] = useState([]);
  const [fireworks, setFireworks] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (username.length > 0) createBubble();
  }, [username]);

  const createBubble = () => {
    const newBubble = {
      id: Math.random(),
      left: Math.random() * 100 + "vw",
      size: Math.random() * 50 + 20 + "px",
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    };
    setBubbles((prev) => [...prev, newBubble]);
    setTimeout(() => {
      setBubbles((prev) => prev.filter((bubble) => bubble.id !== newBubble.id));
    }, 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", { username, password });
      setFireworks(true); // Trigger fireworks
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{ left: bubble.left, width: bubble.size, height: bubble.size, backgroundColor: bubble.color }}
        ></div>
      ))}

      {fireworks && <div className="fireworks"></div>}

      <div className="register-card">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group password-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => document.body.classList.add("lightning-effect")}
              onBlur={() => document.body.classList.remove("lightning-effect")}
            />
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
