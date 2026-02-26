import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiArrowDownCircle, FiArrowUpCircle, FiLogOut } from "react-icons/fi";
import "./admin.css";

import AdminDeposit from "./AdminDeposit";
import AdminWithdrawals from "./AdminWithdrawals"; // ⭐ NEW
import Users from "./Users";

export default function ProfessionalDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="admin-container">

      <aside className="sidebar">

        <div className="brand">
          RAKUTEN <span>ADMIN</span>
        </div>

        <nav className="menu">

          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            <FiUsers /> Users
          </button>

          <button
            className={activeTab === "deposit" ? "active" : ""}
            onClick={() => setActiveTab("deposit")}
          >
            <FiArrowDownCircle /> Deposits
          </button>

          <button
            className={activeTab === "withdrawal" ? "active" : ""}
            onClick={() => setActiveTab("withdrawal")}
          >
            <FiArrowUpCircle /> Withdrawals
          </button>

        </nav>

        <button
          className="logout-btn"
          onClick={() => navigate("/login")}
        >
          <FiLogOut /> Logout
        </button>

      </aside>

      <main className="main-content">

        <div className="dash-header">
          <h2>{activeTab.toUpperCase()}</h2>
        </div>

        {/* CONTENT SWITCHER */}

        {activeTab === "users" && <Users />}

        {activeTab === "deposit" && <AdminDeposit />}

        {activeTab === "withdrawal" && <AdminWithdrawals />} {/* ⭐ WORKING */}

      </main>
    </div>
  );
}