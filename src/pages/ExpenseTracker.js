import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { BackendContext } from "../App"; // ✅ Get backend URL from context
import "../css/expense.css";

Chart.register(ArcElement, Tooltip, Legend);

function ExpenseTracker() {
  const API_URL = useContext(BackendContext); // ✅ Get API URL from context
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/expenses/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data);
        setTotalSpent(res.data.reduce((sum, exp) => sum + exp.amount, 0));
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, [API_URL]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!category || !amount) return alert("Please enter all fields");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        recurring ? `${API_URL}/api/expenses/recurring/add` : `${API_URL}/api/expenses/add`,
        { category, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const editExpense = async (exp) => {
    const newAmount = prompt("Enter new amount:", exp.amount);
    if (!newAmount) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/expenses/edit/${exp._id}`, { 
        amount: newAmount 
      }, { headers: { Authorization: `Bearer ${token}` } });
      window.location.reload();
    } catch (error) {
      console.error("Error editing expense:", error);
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/api/expenses/delete/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        window.location.reload();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  useEffect(() => {
    if (totalSpent > budget) {
      alert("⚠️ Budget exceeded!");
    }
  }, [totalSpent, budget]);

  const chartData = {
    labels: expenses.map((exp) => exp.category),
    datasets: [
      {
        data: expenses.map((exp) => exp.amount),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
      },
    ],
  };

  return (
    <div className="tracker-container">
      <h1>Expense Tracker</h1>

      {/* Budget Input */}
      <input 
        type="number" 
        placeholder="Set Budget" 
        value={budget} 
        onChange={(e) => setBudget(Number(e.target.value))} 
        className="budget-input"
      />
      <p>Total Spent: ${totalSpent}</p>
      <p className={totalSpent > budget ? "over-budget" : "within-budget"}>
        {totalSpent > budget ? "⚠️ Over Budget!" : "✅ Within Budget"}
      </p>

      {/* Expense Form */}
      <form onSubmit={handleAddExpense} className="expense-form">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Food">🍔 Food</option>
          <option value="Transport">🚗 Transport</option>
          <option value="Shopping">🛍 Shopping</option>
          <option value="Rent">🏠 Rent</option>
          <option value="Entertainment">🎮 Entertainment</option>
        </select>
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />
        <label>
          <input 
            type="checkbox" 
            checked={recurring} 
            onChange={(e) => setRecurring(e.target.checked)} 
          /> Recurring Expense
        </label>
        <button type="submit">Add Expense</button>
      </form>

      {/* Expenses Table */}
      <table className="expense-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td>{exp.category}</td>
              <td>${exp.amount}</td>
              <td>{new Date(exp.date).toLocaleString()}</td>
              <td>{exp.recurring ? "🔁 Recurring" : "One-Time"}</td>
              <td>
                <button onClick={() => editExpense(exp)}>✏️ Edit</button>
                <button onClick={() => deleteExpense(exp._id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pie Chart */}
      <div className="chart-container">
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default ExpenseTracker;
