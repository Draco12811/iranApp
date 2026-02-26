import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiSettings, FiArrowDownLeft, FiArrowUpRight, FiX, FiGift, FiDownload } from "react-icons/fi";
import { Disc } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import "./mine.css";

export default function Mine() {
  const nav = useNavigate();
  const [showFullImage, setShowFullImage] = useState(false);
  const [me, setMe] = useState({
    username: "Loading...",
    inviteCode: "000000",
    balance: "0.00",
    profilePic: null
  });
useEffect(() => {
  const fetchUser = async () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      nav("/login");
      return;
    }

    const parsed = JSON.parse(savedUser);

    try {
      const res = await fetch("https://iran-backend.onrender.com0/api/admin/users");
      const users = await res.json();

      const current = users.find(
        u => Number(u.id) === Number(parsed.id)
      );

      if (!current) {
        nav("/login");
        return;
      }

      setMe({
        username: current.username || "User",
        inviteCode: current.inviteCode || "129001",
        balance: Number(current.balance || 0).toFixed(2),
        profilePic: current.profilePic || null
      });

    } catch (err) {
      console.error(err);
      nav("/login");
    }
  };

  fetchUser();
}, [nav]);

  const avatarToShow = me.profilePic || "https://image2url.com/r2/default/images/1771361574190-83505a16-1a01-4a0b-990c-46cae688ae5f.png";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rk-page">
      <div className="rk-bg" />
      <AnimatePresence>
        {showFullImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-overlay" onClick={() => setShowFullImage(false)}>
            <FiX className="close-btn" />
            <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={avatarToShow} className="full-img" alt="profile" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rk-wrap">
        <div className="rk-topbar">
          <div className="rk-title">RAKUTEN <span className="gold-text">GLOBAL</span></div>
        </div>

        <div className="rk-card rk-usercard">
          <div className="user-row">
            <div className="rk-avatar" onClick={() => setShowFullImage(true)} style={{ backgroundImage: `url(${avatarToShow})` }} />
            <div className="rk-userinfo">
              <div className="rk-name">{me.username}</div>
              <div className="rk-invite">Invitation Code: <span className="gold-text">{me.inviteCode}</span></div>
            </div>
          </div>
          <div className="dl-btn" onClick={() => window.open("/app-release.apk", "_blank")}>
            <FiDownload color="#f39c12" size={18} />
            <span className="dl-text">APP DOWNLOAD</span>
          </div>
        </div>

        <div className="rk-card">
          <div className="rk-btitle-small">Balance Card</div>
          <div className="rk-balance-row-small">
            <div className="rk-amount-small">{me.balance}</div>
            <div className="rk-unit-small">USDT</div>
          </div>
          <div className="rk-actions-compact">
            <button className="rk-btn-small rk-btn-red" onClick={() => nav("/deposit")}>Deposit</button>
            <button className="rk-btn-small rk-btn-white" onClick={() => nav("/withdraw")}>Withdraw</button>
          </div>
        </div>

        <div className="rk-grid">
          <div className="rk-item" onClick={() => nav("/luckydraw")}><div className="rk-ico-box gold-grad"><FiGift /></div><span>Lucky Draw</span></div>
          <div className="rk-item" onClick={() => nav("/luckyspin")}>
            <div className="rk-ico-box gold-grad">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ display: 'flex' }}><Disc size={20} /></motion.div>
            </div>
            <span>Lucky Spin</span>
          </div>
          <div className="rk-item" onClick={() => nav("/wallet")}><div className="rk-ico-box"><FiCreditCard /></div><span>Wallet</span></div>
          <div className="rk-item" onClick={() => nav("/settings")}><div className="rk-ico-box"><FiSettings /></div><span>Settings</span></div>
          <div className="rk-item" onClick={() => nav("/deposit-records")}><div className="rk-ico-box icon-red"><FiArrowDownLeft /></div><span>Deposit Record</span></div>
          <div className="rk-item" onClick={() => nav("/withdrawal-records")}><div className="rk-ico-box icon-red"><FiArrowUpRight /></div><span>Withdraw Record</span></div>
        </div>
      </div>
      <div className="rk-bottom-space" />
    </motion.div>
  );
}