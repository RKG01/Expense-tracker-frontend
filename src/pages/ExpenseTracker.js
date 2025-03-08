import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "../css/expense.css";

Chart.register(ArcElement, Tooltip, Legend);

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/expenses/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
      setTotalSpent(res.data.reduce((sum, exp) => sum + exp.amount, 0));
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!category || !amount) return alert("Please enter all fields");

    const token = localStorage.getItem("token");
    await axios.post(
      recurring ? "http://localhost:5000/api/expenses/recurring/add" : "http://localhost:5000/api/expenses/add",
      { category, amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    window.location.reload();
  };

  const editExpense = async (exp) => {
    const newAmount = prompt("Enter new amount:", exp.amount);
    if (!newAmount) return;

    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/expenses/edit/${exp._id}`, { 
      amount: newAmount 
    }, { headers: { Authorization: `Bearer ${token}` } });

    window.location.reload();
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/expenses/delete/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      window.location.reload();
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
