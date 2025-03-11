import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Income.css";

const API_URL = process.env.REACT_APP_BACKEND_URL; // ✅ Use Backend URL

function IncomeTracker() {
  const [incomes, setIncomes] = useState([]);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);

  // Fetch incomes from backend
  useEffect(() => {
    const fetchIncomes = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/income/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(res.data);
      setTotalIncome(res.data.reduce((sum, inc) => sum + inc.amount, 0));
    };
    fetchIncomes();
  }, []);

  // Add new income
  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!source || !amount) return alert("Please enter all fields");

    const token = localStorage.getItem("token");
    await axios.post(
      `${API_URL}/api/income/add`,
      { source, amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    window.location.reload();
  };

  // Edit income
  const editIncome = async (inc) => {
    const newAmount = prompt("Enter new amount:", inc.amount);
    if (!newAmount) return;

    const token = localStorage.getItem("token");
    await axios.put(
      `${API_URL}/api/income/edit/${inc._id}`,
      { amount: newAmount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.reload();
  };

  // Delete income
  const deleteIncome = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/income/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    }
  };

  return (
    <div className="tracker-container">
      <h1>Income Tracker</h1>

      {/* Total Income Display */}
      <p>Total Income: ${totalIncome}</p>

      {/* Income Form */}
      <form onSubmit={handleAddIncome} className="income-form">
        <input
          type="text"
          placeholder="Income Source (Salary, Freelancing, etc.)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Income</button>
      </form>

      {/* Incomes Table */}
      <table className="income-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((inc) => (
            <tr key={inc._id}>
              <td>{inc.source}</td>
              <td>${inc.amount}</td>
              <td>{new Date(inc.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => editIncome(inc)}>✏️ Edit</button>
                <button onClick={() => deleteIncome(inc._id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncomeTracker;
