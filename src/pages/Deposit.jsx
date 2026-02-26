import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./deposit.css";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    message: ""
  });

  const nav = useNavigate();

  const quickAmounts = [20, 50, 100, 500, 1000, 3000, 5000];

  // ================= SUBMIT =================

  const handleNext = async () => {
    const numAmt = Number(amount);

    if (!amount || numAmt < 10) {
      setAlertConfig({
        isVisible: true,
        message: "Minimum deposit amount is 10 USDT"
      });
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!storedUser) {
      setAlertConfig({
        isVisible: true,
        message: "Session expired. Please login again."
      });
      return;
    }

    // 🔥 ADMIN KO REQUEST SAVE
    await fetch("https://iran-backend.onrender.com0/api/user/create-deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: storedUser.id,
        amount: numAmt
      })
    });

    // 🔥 PAYMENT INFO PAGE PAR JAO
    nav("/payment-info", {
      state: { depositAmount: numAmt }
    });
  };

  // ================= UI =================

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rk-page-fixed"
      style={{ background: "#0b0b0b", minHeight: "100vh" }}
    >
      {/* ALERT MODAL */}
      <AnimatePresence>
        {alertConfig.isVisible && (
          <div style={overlayStyle}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={modalStyle}
            >
              <FiAlertCircle
                style={{
                  color: "#f3ba2f",
                  fontSize: "40px",
                  marginBottom: "10px"
                }}
              />

              <p style={{ color: "#fff", textAlign: "center" }}>
                {alertConfig.message}
              </p>

              <button
                onClick={() =>
                  setAlertConfig({ ...alertConfig, isVisible: false })
                }
                style={modalBtnStyle}
              >
                OK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div style={{ padding: "15px", display: "flex", alignItems: "center" }}>
        <FiChevronLeft
          onClick={() => nav(-1)}
          style={{ color: "#fff", fontSize: "24px", cursor: "pointer" }}
        />
        <span style={{ color: "#fff", marginLeft: "10px", fontWeight: "bold" }}>
          Deposit USDT
        </span>
      </div>

      <div style={{ padding: "20px" }}>
        {/* AMOUNT BOX */}
        <div
          style={{
            background: "#16181d",
            padding: "15px",
            borderRadius: "12px"
          }}
        >
          <label style={{ color: "#aaa", fontSize: "12px" }}>Amount</label>

          <input
            type="number"
            placeholder="Min 10 USDT"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "#f3ba2f",
              fontSize: "20px",
              width: "100%",
              outline: "none",
              marginTop: "5px"
            }}
          />
        </div>

        {/* QUICK AMOUNTS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            marginTop: "20px"
          }}
        >
          {quickAmounts.map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              style={{
                background: "#16181d",
                color: "#fff",
                border: "1px solid #333",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              {val}
            </button>
          ))}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleNext}
          style={{
            background: "#f3ba2f",
            color: "#000",
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            fontWeight: "bold",
            marginTop: "30px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Submit Deposit Request
        </button>
      </div>
    </motion.div>
  );
}

// ================= STYLES =================

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#1c1e22",
  padding: "20px",
  borderRadius: "15px",
  width: "250px",
  textAlign: "center"
};

const modalBtnStyle = {
  background: "#f3ba2f",
  border: "none",
  padding: "8px 30px",
  borderRadius: "5px",
  marginTop: "15px",
  fontWeight: "bold"
};