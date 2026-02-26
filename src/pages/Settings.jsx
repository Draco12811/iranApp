import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiUser,
  FiLock,
  FiGlobe,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Settings() {
  const nav = useNavigate();

  const [showPassModal, setShowPassModal] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passData, setPassData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // ✅ REAL USER FROM LOCALSTORAGE
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const me = {
    username: storedUser?.username || "User",
    inviteCode: storedUser?.inviteCode || "000000",
    profilePic:
      storedUser?.profilePic ||
      "https://image2url.com/r2/default/images/1771361574190-83505a16-1a01-4a0b-990c-46cae688ae5f.png"
  };

  const avatarToShow = me.profilePic;

  // ================= PASSWORD UPDATE =================
  const handlePasswordUpdate = async () => {
    if (!passData.current || !passData.new || !passData.confirm) {
      return alert("All fields are required!");
    }

    if (passData.new !== passData.confirm) {
      return alert("New passwords do not match!");
    }

    setLoading(true);

    try {
      const uid = storedUser?.id;

      if (!uid) {
        alert("Session expired. Please login again.");
        nav("/login");
        return;
      }

      const res = await axios.post(
        "https://iran-backend.onrender.com0/api/user/change-password",
        {
          userId: uid,
          currentPassword: passData.current,
          newPassword: passData.new
        }
      );

      if (res.data.success) {
        alert("Password updated successfully!");
        setShowPassModal(false);
        setPassData({ current: "", new: "", confirm: "" });
      } else {
        alert(res.data.message || "Error updating password");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI ITEM =================
  const settingItem = (icon, title, subtitle, onClick) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        background: "#111",
        borderRadius: "15px",
        marginBottom: "12px",
        cursor: "pointer",
        border: "1px solid #222"
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "#1a1a1a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "15px",
          color: "#ffaa00"
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "15px", fontWeight: "500", color: "#fff" }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: "12px", color: "#666" }}>{subtitle}</div>
        )}
      </div>

      <FiChevronRight style={{ color: "#444" }} />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background:
          "radial-gradient(circle at top, #2a0505 0%, #000000 100%)",
        minHeight: "100vh",
        color: "#fff"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "15px",
          borderBottom: "1px solid #221111"
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
            fontWeight: "500",
            marginRight: "24px"
          }}
        >
          Settings
        </span>
      </div>

      <div style={{ padding: "20px" }}>
        {/* PROFILE CARD */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "25px",
            border: "1px solid #331111",
            display: "flex",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#333",
              marginRight: "15px",
              border: "2px solid #ffaa00",
              overflow: "hidden"
            }}
          >
            <img
              src={avatarToShow}
              alt="dp"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              {me.username}
            </div>
            <div style={{ fontSize: "13px", color: "#aaa" }}>
              Code: {me.inviteCode}
            </div>
          </div>
        </div>

        {settingItem(<FiUser />, "Profile", "Manage Information", () =>
          nav("/profile")
        )}

        {settingItem(
          <FiLock />,
          "Change Password",
          "Update Security",
          () => setShowPassModal(true)
        )}

        {settingItem(<FiGlobe />, "Language", "Select Language", () => {})}

        <button
          onClick={() => {
            localStorage.removeItem("user");
            nav("/login");
          }}
          style={logoutBtnStyle}
        >
          Logout Account
        </button>
      </div>

      {/* ================= POPUP ================= */}
      <AnimatePresence>
        {showPassModal && (
          <div style={overlayStyle}>
            <div
              onClick={() => setShowPassModal(false)}
              style={backdropStyle}
            />

            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              style={modalStyle}
            >
              <div style={modalHeader}>
                <h3 style={{ color: "#ffaa00", margin: 0 }}>
                  Change Password
                </h3>
                <FiX
                  onClick={() => setShowPassModal(false)}
                  style={{ cursor: "pointer" }}
                />
              </div>

              <input
                type={showPass ? "text" : "password"}
                placeholder="Current Password"
                style={inputStyle}
                value={passData.current}
                onChange={(e) =>
                  setPassData({ ...passData, current: e.target.value })
                }
              />

              <input
                type={showPass ? "text" : "password"}
                placeholder="New Password"
                style={inputStyle}
                value={passData.new}
                onChange={(e) =>
                  setPassData({ ...passData, new: e.target.value })
                }
              />

              <input
                type={showPass ? "text" : "password"}
                placeholder="Confirm Password"
                style={inputStyle}
                value={passData.confirm}
                onChange={(e) =>
                  setPassData({ ...passData, confirm: e.target.value })
                }
              />

              <button
                onClick={handlePasswordUpdate}
                disabled={loading}
                style={saveBtnStyle}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ================= STYLES =================

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const backdropStyle = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.8)"
};

const modalStyle = {
  position: "relative",
  width: "90%",
  maxWidth: "380px",
  background: "#16181d",
  padding: "25px",
  borderRadius: "20px",
  zIndex: 2
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "15px",
  alignItems: "center"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#0a0a0a",
  color: "#fff"
};

const saveBtnStyle = {
  width: "100%",
  padding: "14px",
  background: "#ffaa00",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer"
};

const logoutBtnStyle = {
  width: "100%",
  marginTop: "20px",
  padding: "16px",
  background: "#111",
  color: "#ff4444",
  border: "1px solid #222",
  borderRadius: "15px",
  fontWeight: "600",
  cursor: "pointer"
};