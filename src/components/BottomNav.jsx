import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiHeadphones, FiActivity, FiUser } from "react-icons/fi";
import { Zap } from "lucide-react";
import "./bottomnav.css";

export default function BottomNav() {
  // Filhal hasUnread false hai, baad mein hum isse MongoDB se connect karenge
  const [hasUnread, setHasUnread] = useState(false);

  return (
    <div className="bottomNav">
      <NavLink to="/home" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
        <FiHome className="navIcon" />
        <p>Home</p>
      </NavLink>

      <NavLink to="/service" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
        <div style={{ position: "relative" }}>
          <FiHeadphones className="navIcon" />
          {hasUnread && <span className="unreadDot"></span>}
        </div>
        <p>Service</p>
      </NavLink>

      <NavLink to="/grab" className={({ isActive }) => `navItem grabItem${isActive ? " active" : ""}`}>
        <div className="grabActionBtn">
          <Zap size={26} className="grabZapIcon" />
        </div>
        <p className="grabText">Grab</p>
      </NavLink>

      <NavLink to="/record" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
        <FiActivity className="navIcon" />
        <p>Record</p>
      </NavLink>

      <NavLink to="/mine" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
        <FiUser className="navIcon" />
        <p>Mine</p>
      </NavLink>
    </div>
  );
}