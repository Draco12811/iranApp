import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./record.css";

export default function Record() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("unpaid");
  const [history, setHistory] = useState([]);
  const [pendingTrans, setPendingTrans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const API_URL = "https://iran-backend.onrender.com0/api";
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const fetchData = async () => {
    try {
      const uRes = await fetch(`${API_URL}/admin/users`);
      const users = await uRes.json();
      const current = users.find(u => u.username === storedUser?.username);
      setUserData(current);

      const tRes = await fetch(`${API_URL}/admin/transactions`);
      const allT = await tRes.json();

      const myTrans = allT.filter(t => t.userId === current?.id);

      setHistory(myTrans.filter(t => t.status === "Completed").reverse());
      setPendingTrans(myTrans.find(t => t.status === "Pending"));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storedUser) fetchData();
  }, []);

  const handleClearGap = async () => {
    if (!pendingTrans || !userData) return;

    if (parseFloat(userData.balance) < parseFloat(pendingTrans.amount)) {
      return setMsg("Insufficient Balance to clear this task.");
    }

    try {
      const res = await fetch(`${API_URL}/admin/clear-gap`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          userId: userData.id,
          transId: pendingTrans.id
        })
      });

      const data = await res.json();

      if (data.success) {
        setMsg("Task Completed Successfully!");
        setTimeout(() => {
          setMsg("");
          fetchData();
        }, 2000);
      } else {
        setMsg("Error Clearing Task");
      }

    } catch {
      setMsg("Failed to clear task");
    }
  };

  return (
    <div className="record-container" style={{background:'#000',minHeight:'100vh'}}>

      <AnimatePresence>
        {loading && (
          <div className="rk-loader-fix">
            <div className="premium-loader"></div>
          </div>
        )}
      </AnimatePresence>

      <div style={{ opacity: loading ? 0 : 1 }}>

        {msg && (
          <div className="toast-overlay">
            <div className="toast-box">{msg}</div>
          </div>
        )}

        <div className="record-tabs">
          <div className={`tab-item ${activeTab === 'unpaid' ? 'active' : ''}`}
               onClick={() => setActiveTab('unpaid')}>
            Unpaid
          </div>

          <div className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
               onClick={() => setActiveTab('history')}>
            Completed
          </div>
        </div>

        <div className="tab-content">

          {/* ================= UNPAID ================= */}

          {activeTab === "unpaid" ? (
            <div className="unpaid-section">

              {pendingTrans ? (
                <div className="order-card pending">

                  <div className="order-header">
                    <img src={pendingTrans.productImg} alt="" />
                    <div className="order-info">
                      <h4>{pendingTrans.productName}</h4>
                      <span className="time-stamp">{pendingTrans.date}</span>
                    </div>
                    <span className="status-badge unpaid">Pending</span>
                  </div>

                  <div className="order-body">

                    <div className="row">
                      <span>Amount:</span>
                      <b>{pendingTrans.amount} USDT</b>
                    </div>

                    <div className="row">
                      <span>Commission:</span>
                      <b className="text-gold">
                        +{pendingTrans.commission} USDT
                      </b>
                    </div>

<div className="row">
  <span>Required Deposit:</span>
  <b style={{color:'#ff4d4d'}}>
    {Math.max(
      parseFloat(pendingTrans.amount) - parseFloat(userData?.balance || 0),
      0
    ).toFixed(2)} USDT
  </b>
</div>

                  </div>

                  <button
                    className="submit-btn-glow"
                    onClick={handleClearGap}
                  >
                    Submit Now
                  </button>

                </div>
              ) : (
                <div className="empty-state">No Pending Tasks</div>
              )}

            </div>
          ) : (

            /* ================= HISTORY ================= */

            <div className="history-section">

              {history.length > 0 ? history.map((item, i) => (

                <div key={i} className="order-card completed">

                  <div className="order-header">
                    <img src={item.productImg} alt="" />
                    <div className="order-info">
                      <h4>{item.productName}</h4>
                      <span className="time-stamp">{item.date}</span>
                    </div>
                    <span className="status-badge done">Success</span>
                  </div>

                  <div className="order-body">
                    <div className="row">
                      <span>Amount:</span>
                      <span>{item.amount} USDT</span>
                    </div>

                    <div className="row">
                      <span>Profit:</span>
                      <span className="text-gold">
                        +{item.commission} USDT
                      </span>
                    </div>
                  </div>

                </div>

              )) : (
                <div className="empty-state">No History Records</div>
              )}

            </div>

          )}

        </div>
      </div>
    </div>
  );
}