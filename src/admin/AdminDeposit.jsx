import React, { useEffect, useState } from "react";
import "./adminDeposit.css";

export default function AdminDeposits() {

  const [deposits, setDeposits] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [config, setConfig] = useState({
    trcAddress: "",
    qrUrl: "",
    securityPin: "1234"
  });

  const [inputPin, setInputPin] = useState("");

  // ===== LOAD DATA =====
  const loadDeposits = () => {
    fetch("http://66.42.56.21:5000/api/admin/deposits")
      .then(r => r.json())
      .then(data => {
        // 🔥 NEWEST FIRST
        const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
        setDeposits(sorted);
      });
  };

  useEffect(() => {
    loadDeposits();

    fetch("http://66.42.56.21:5000/api/deposit/config")
      .then(r => r.json())
      .then(setConfig);
  }, []);

  // ===== SAVE WALLET CONFIG =====
  const handleSaveSettings = async () => {

    if (inputPin !== config.securityPin) {
      alert("Wrong Password ❌");
      return;
    }

    await fetch("http://66.42.56.21:5000/api/admin/save-deposit-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });

    alert("Saved ✅");
    setShowSettings(false);
    setInputPin("");
  };

  // ===== APPROVE / REJECT =====
  const handleAction = async (id, status) => {

    await fetch("http://66.42.56.21:5000/api/admin/deposit-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ depositId: id, action: status })
    });

    // 🔥 RELOAD DATA
    loadDeposits();
  };

  // ===== FILTERS =====
  const pendingDeposits = deposits.filter(d => d.status === "pending");
  const historyDeposits = deposits.filter(d => d.status !== "pending");

  return (
    <div className="deposit-page">

      {/* ===== TOP BAR ===== */}
      <div className="top-bar">

        <input
          className="search-input"
          placeholder="Search Username..."
        />

        <div className="top-actions">

          <button
            className="history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            📜 History
          </button>

          <button
            className="add-btn"
            onClick={() => setShowSettings(true)}
          >
            +
          </button>

        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="table-wrapper">

        <table className="deposit-table">

          <thead>
            <tr>
              <th>USERNAME</th>
              <th>AMOUNT</th>
              <th>DATE / TIME</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>

            {(showHistory ? historyDeposits : pendingDeposits).map(d => (
              <tr key={d.id}>

                <td>
                  <div className="username">{d.username}</div>
                  <div className="user-id">ID: {d.uid || d.id}</div>
                </td>

                <td className="amount">${d.amount}</td>

                <td className="date">
                  {d.timestamp
                    ? new Date(d.timestamp).toLocaleString()
                    : "--"}
                </td>

                <td>
                  <span className={`status ${d.status}`}>
                    {d.status.toUpperCase()}
                  </span>
                </td>

                <td>
                  {d.status === "pending" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleAction(d.id, "approved")}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => handleAction(d.id, "rejected")}
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

      {/* ===== WALLET SETTINGS MODAL ===== */}
      {showSettings && (
        <div className="wallet-modal-overlay">

          <div className="wallet-modal">

            <h3>Wallet Config</h3>

            <input
              placeholder="TRC Address"
              value={config.trcAddress}
              onChange={e =>
                setConfig({ ...config, trcAddress: e.target.value })
              }
            />

            <input
              placeholder="QR Image URL"
              value={config.qrUrl}
              onChange={e =>
                setConfig({ ...config, qrUrl: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Admin Password"
              value={inputPin}
              onChange={e => setInputPin(e.target.value)}
            />

            <div className="modal-actions">

              <button
                className="modal-cancel"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </button>

              <button
                className="modal-save"
                onClick={handleSaveSettings}
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}