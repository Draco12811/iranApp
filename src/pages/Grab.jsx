import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import "./grab.css";
import OrderHistoryDetails from "../components/OrderHistoryDetails";
import { ALL_PRODUCTS } from "../data/products";

export default function Grab() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState(null);
  const [msg, setMsg] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [wheelItems, setWheelItems] = useState([]);
  const [targetSlot, setTargetSlot] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCycleReport, setShowCycleReport] = useState(false);

  const API_URL = "http://66.42.56.21:5000/api";
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const username = storedUser?.username;

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`);
      const users = await res.json();
      const current = users.find((u) => u.username === username);
      if (!current) { window.location.href = "/login"; return; }
      setUserData(current);
      prepareWheel(current);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const prepareWheel = (data) => {
    if (spinning || (data.cycleOrders || 0) >= 25) return;
    const nextTask = (data.cycleOrders || 0) + 1;
    const trap = (data.traps || []).find((t) => Number(t.taskNum) === nextTask);
    const shuffled = [...ALL_PRODUCTS].sort(() => 0.5 - Math.random());
    const items = shuffled.slice(0, 8);
    const pos = Math.floor(Math.random() * 8);
    setTargetSlot(pos);
    if (trap) { items[pos] = { ...items[pos], isTrap: true, trapData: trap }; }
    setWheelItems(items);
  };

  useEffect(() => { fetchUserData(); }, [username]);

  const showToast = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleSpin = () => {
    if (spinning || !userData || wheelItems.length === 0) return;
    if (userData.isFrozen) return showToast("Account Frozen");
    if (parseFloat(userData.cashGap) > 0) return showToast("Pending Task! Clear it in Records first.");
    if (userData.cycleOrders >= 25) return showToast("Please Contact With Customer Service For Grabbing again");
    if (Number(userData.balance) < 1) return showToast("Insufficient Balance");

    setSpinning(true);
    setShow(false);
    const rotations = 8 * 360;
    const landingRotation = (360 - targetSlot * 45) % 360;
    const finalRotation = rotation + rotations + (landingRotation - (rotation % 360));
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      const selected = wheelItems[targetSlot];
      let finalOrder;
      if (selected.isTrap) {
        const trapAmt = Number(selected.trapData.trapAmount);
        const trapRate = Number(selected.trapData.trapPercent);
        finalOrder = { ...selected, amount: trapAmt.toFixed(2), comm: (trapAmt * trapRate / 100).toFixed(2), commRate: trapRate + "%" };
      } else {
        const bal = Number(userData.balance);
        const amt = Math.random() * (bal * 0.9 - bal * 0.1) + bal * 0.1;
        const rate = Math.random() * 3 + 2;
        finalOrder = { ...selected, amount: amt.toFixed(2), comm: (amt * rate / 100).toFixed(2), commRate: rate.toFixed(1) + "%" };
      }
      setResult(finalOrder);
      setShow(true);
    }, 3000);
  };

  const handleSubmitOrder = async () => {
    if (!result || !userData) return;
    try {
      const res = await fetch(`${API_URL}/admin/update-order-stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          amount: result.amount,
          comm: result.comm,
          productName: result.title,
          productImg: result.img,
          isTrap: result.isTrap || false
        })
      });

      // 🔥 MATCHING FIX: Check if response is OK
      if (!res.ok) {
        throw new Error("Server Error");
      }

      const data = await res.json();
      
      // 🔥 MATCHING FIX: Backend returns 'success' and 'user'
      if (data.success && data.user) {
        setUserData(data.user);
        setShow(false);
        
        if (parseFloat(data.user.cashGap) > 0) {
          showToast("Insufficient balance! Moved to Pending.");
          setTimeout(() => { fetchUserData(); }, 2000);
        } else {
          setSubmitSuccess(true);
          setTimeout(() => { 
            setSubmitSuccess(false);
            fetchUserData(); 
          }, 2000);
        }
      } else {
        showToast(data.message || "Update Failed");
      }
    } catch (error) { 
      console.error("Submit Error:", error);
      showToast("Update Failed"); 
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grab-main-container">
      <AnimatePresence>{loading && <div className="premium-loader-overlay"><div className="premium-loader"></div></div>}</AnimatePresence>
      <AnimatePresence>{submitSuccess && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="success-message-overlay"><div className="success-message-box"><FiCheckCircle className="success-msg-icon" /><span>Order Submitted</span></div></motion.div>}</AnimatePresence>
      {msg && <div className="toast-overlay"><div className="toast-box">{msg}</div></div>}
      
      <h2 className="top-title">Start Boosting</h2>
      <div className="stats-grid-new">
        <div className="stat-card-item"><label>Today Commission</label><p style={{color: "#ffb300"}}>{Number(userData?.todayCommission || 0).toFixed(2)}</p></div>
        <div className="stat-card-item"><label>Wallet Balance</label><p style={{color: "#ffb300"}}>{Number(userData?.balance || 0).toFixed(2)}</p></div>
        <div className="stat-card-item">
          <label>Cash Gap</label>
          <p style={{color: parseFloat(userData?.cashGap) > 0 ? "#ff4d4d" : "#48a733"}}>
            {parseFloat(userData?.cashGap) > 0 ? "-" + userData.cashGap : "0.00"} USDT
          </p>
        </div>
        <div className="stat-card-item"><label>Status</label><p style={{color: userData?.isFrozen ? "#ff4d4d" : "#00ff00b8"}}>{userData?.isFrozen ? "Frozen" : "Active"}</p></div>
      </div>
<div style={{ display: "flex", justifyContent: "flex-end", width: "92%", margin: "15px auto" }}>
  <div className="order-counter-pill">
    <span>{userData?.cycleOrders || 0}/25 Completed</span>
  </div>
</div>

      <div className="wheel-outer-box">
        <div className="main-glow-ring">
          <div className="wheel-surface" style={{ transition: spinning ? "transform 3s cubic-bezier(0.2,0,0,1)" : "none", transform: `rotate(${rotation}deg)` }}>
            {wheelItems.map((item, i) => (
              <div className="item-slot" key={i} style={{ transform: `rotate(${i * 45}deg)` }}>
                <div className="icon-gold-frame"><img src={item.img} alt="" /></div>
              </div>
            ))}
          </div>
          <div className="grab-btn-center" onClick={handleSpin}><div className="grab-inner-circle">{spinning ? "..." : "START"}</div></div>
        </div>
      </div>

      <AnimatePresence>
        {show && result && (
          <div className="custom-popup-overlay">
            <div className="custom-popup-content">
              <div className="close-x-handler" onClick={() => { setShow(false); setResult(null); }}>×</div>
              <div className="p-img-box"><img src={result.img} alt="" /></div>
              <h4 className="p-name">{result.title}</h4>
              <div className="p-details">
                <div className="p-row"><span>Amount</span><span>{result.amount} USDT</span></div>
                <div className="p-row"><span>Rate</span><span className="gold-text">{result.commRate}</span></div>
                <div className="p-row"><span>Commission</span><span className="gold-text">+{result.comm} USDT</span></div>
              </div>
              <button className="p-btn-glow" onClick={handleSubmitOrder}>Submit Order</button>
            </div>
          </div>
        )}
      </AnimatePresence>
      {showCycleReport && <OrderHistoryDetails userData={userData} onClose={() => setShowCycleReport(false)} />}
    </motion.div>
  );
}