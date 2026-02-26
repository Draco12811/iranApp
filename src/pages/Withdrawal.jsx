import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Withdrawal() {
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");

  const [userData, setUserData] = useState({
    balance: 0,
    password: "",
    walletAddress: "",
    totalOrders: 0,
    cycleOrders: 0
  });

  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userUID = storedUser?.id;

  // ================= LOAD DATA FROM SERVER =================
  useEffect(() => {

    const loadUserData = async () => {

      if (!userUID) {
        setLoading(false);
        return;
      }

      try {

        // 🔹 Wallet
        const wRes = await fetch(
          `https://iran-backend.onrender.com0/api/user/wallet/${userUID}`
        );
        const wData = await wRes.json();

        // 🔹 User info (balance, password, tasks)
        const uRes = await fetch(
          "https://iran-backend.onrender.com0/api/admin/users"
        );
        const users = await uRes.json();

        const user = users.find(
          u => Number(u.id) === Number(userUID)
        );

        if (user) {
          setUserData({
            balance: parseFloat(user.balance || 0),
            password: user.password || "",
            walletAddress: wData.walletAddress || "",
            totalOrders: user.totalOrders || 0,
            cycleOrders: user.cycleOrders || 0
          });
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to load user data");
      }

      setLoading(false);
    };

    loadUserData();

  }, [userUID]);

  // ================= WITHDRAW =================
  const handleWithdrawal = async (e) => {
    e.preventDefault();

    const withdrawAmt = parseFloat(amount);

    // ❌ WALLET CHECK
    if (!userData.walletAddress) {
      toast.error("Wallet address not bound!");
      return;
    }

    // ❌ TASK RULE (GRAB)
    // Allow ONLY if cycleOrders = 0 OR 25
    if (
      userData.cycleOrders > 0 &&
      userData.cycleOrders < 25
    ) {
      toast.error(
        "Please complete all 25 tasks to perform withdrawal (0 or 25 required)"
      );
      return;
    }

    // ❌ PASSWORD CHECK
    if (password !== userData.password) {
      toast.error("Incorrect transaction password!");
      return;
    }

    // ❌ AMOUNT CHECKS
    if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawAmt < 10) {
      toast.warning("Minimum withdrawal is $10");
      return;
    }

    if (withdrawAmt > userData.balance) {
      toast.error("Insufficient balance!");
      return;
    }

    // ✅ SEND TO SERVER
    setLoading(true);

    fetch("https://iran-backend.onrender.com0/api/user/create-withdrawal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userUID,
        amount,
        walletAddress: userData.walletAddress,
        password
      })
    })
      .then(r => r.json())
      .then(data => {
        setLoading(false);

        if (!data.success) {
          toast.error(data.message);
          return;
        }

        toast.success("Withdrawal request submitted!");
        setTimeout(() => nav("/mine"), 2000);
      });
  };

  return (
    <div
      style={{ background: "#0b0b0b", minHeight: "100vh", color: "#fff" }}
      onClick={() => {
        document.activeElement.blur();
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }}
    >
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#0b0b0b",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div className="premium-loader"></div>
        </div>
      )}

      <ToastContainer theme="dark" position="top-center" autoClose={2000} />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "15px",
          background: "#0b0b0b",
          borderBottom: "1px solid #1a1a1a"
        }}
      >
        <FiChevronLeft
          style={{ fontSize: "24px", cursor: "pointer" }}
          onClick={() => nav(-1)}
        />
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "600",
            marginRight: "24px"
          }}
        >
          Withdraw
        </span>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Balance Card */}
        <div
          style={{
            background: "rgba(243, 186, 47, 0.05)",
            padding: "25px 20px",
            borderRadius: "15px",
            textAlign: "center",
            marginTop: "20px",
            border: "1px solid rgba(243, 186, 47, 0.2)"
          }}
        >
          <p style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>
            Available Balance
          </p>
          <h2
            style={{
              color: "#f3ba2f",
              fontSize: "32px",
              margin: 0,
              fontWeight: "bold"
            }}
          >
            ${userData.balance.toFixed(2)}
          </h2>
        </div>

        <form
          onSubmit={handleWithdrawal}
          style={{ marginTop: "30px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Wallet Address */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#888", fontSize: "13px", display: "block", marginBottom: "10px" }}>
              Withdrawal Wallet
            </label>

            <input
              type="text"
              value={userData.walletAddress ? userData.walletAddress : "Not Bound"}
              readOnly
              style={{
                width: "100%",
                padding: "16px",
                background: "#16181d",
                border: "1px solid #222",
                borderRadius: "12px",
                color: userData.walletAddress ? "#f3ba2f" : "#ff4d4d",
                fontSize: "16px",
                fontWeight: "600",
                textAlign: "center",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Amount */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#888", fontSize: "13px", display: "block", marginBottom: "10px" }}>
              Amount
            </label>

            <input
              type="number"
              placeholder="Enter withdrawal amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "16px",
                background: "#000",
                border: "1px solid #333",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "30px" }}>
            <label style={{ color: "#888", fontSize: "13px", display: "block", marginBottom: "10px" }}>
              Transaction Password
            </label>

            <input
              type="password"
              placeholder="Enter transaction password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "16px",
                background: "#000",
                border: "1px solid #333",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              background: "#f3ba2f",
              border: "none",
              borderRadius: "12px",
              color: "#000",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(243, 186, 47, 0.2)"
            }}
          >
            Confirm Withdrawal
          </button>
        </form>
      </div>
    </div>
  );
}