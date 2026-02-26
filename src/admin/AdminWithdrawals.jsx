import React, { useEffect, useState } from "react";
import "./adminWithdraw.css";

export default function AdminWithdrawals() {

  const [withdrawals, setWithdrawals] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadWithdrawals = () => {
    fetch("https://iran-backend.onrender.com0/api/admin/withdrawals")
      .then(r => r.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
        setWithdrawals(sorted);
      });
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const handleAction = async (id, status) => {
    await fetch("https://iran-backend.onrender.com0/api/admin/withdraw-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ withdrawalId: id, action: status })
    });

    loadWithdrawals();
  };

  const pending = withdrawals.filter(w => w.status === "pending");
  const history = withdrawals.filter(w => w.status !== "pending");

  return (
    <div className="withdraw-page-admin">

      {/* TOP BAR */}
      <div className="top-bar">

        <input
          className="search-input"
          placeholder="Search Username..."
        />

        <button
          className="history-btn"
          onClick={() => setShowHistory(!showHistory)}
        >
          View History
        </button>

      </div>

      {/* TABLE */}
      <div className="table-wrapper">

        <table className="withdraw-table">

          <thead>
            <tr>
              <th>USER INFO</th>
              <th>AMOUNT</th>
              <th>TRC20 WALLET</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>

            {(showHistory ? history : pending).map(w => (
              <tr key={w.id}>

                <td>
                  <div className="username">{w.username}</div>
                  <div className="user-id">ID: {w.uid}</div>
                </td>

                <td className="amount">${w.amount}</td>

                <td className="wallet">{w.wallet}</td>

                <td>
                  <span className={`status ${w.status}`}>
                    {w.status.toUpperCase()}
                  </span>
                </td>

                <td>
                  {w.status === "pending" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleAction(w.id, "approved")}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => handleAction(w.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

    </div>
  );
}