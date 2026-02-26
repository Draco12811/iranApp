import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiCopy } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./deposit.css";

export default function PaymentInfo() {
  const location = useLocation();
  const nav = useNavigate();
  
  // Get amount from navigation state
  const amount = location.state?.depositAmount || 0;

  // ✅ CONFIG — NOW FROM DB
  const [config, setConfig] = useState({
    trcAddress: "",
    qrUrl: ""
  });

  const [showToast, setShowToast] = useState(false);

  // 🔥 LOAD WALLET CONFIG FROM SERVER
  useEffect(() => {
    fetch("https://iran-backend.onrender.com0/api/deposit/config")
      .then(res => res.json())
      .then(data => {
        if (data) setConfig(data);
      })
      .catch(() => {});
  }, []);

  const copyAddress = () => {
    if (config.trcAddress) {
      navigator.clipboard.writeText(config.trcAddress);
      triggerToast();
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const qrSource =
    config.qrUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${config.trcAddress}`;

  return (
    <div className="rk-page-fixed" style={{ background: '#0b0b0b', height: '100vh', overflow: 'hidden' }}>
      
      {/* Copy Notification Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            style={toastStyle}
          >
            Address Copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="rk-dep-header" style={{ height: '50px', display: 'flex', alignItems: 'center', padding: '0 15px' }}>
        <FiChevronLeft className="back-btn" onClick={() => nav(-1)} style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} />
        <span className="title" style={{ color: '#fff', marginLeft: '10px', fontSize: '17px', fontWeight: '600' }}>Payment Information</span>
      </div>

      <div className="rk-wrap payment-wrap" style={{ padding: '10px 20px' }}>
        
        {/* Payable Amount Card */}
        <div className="amount-focus" style={{ background: '#16181d', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <p style={{ color: '#888', margin: '0', fontSize: '12px' }}>Total Payable Amount</p>
          <h2 style={{ color: '#f3ba2f', margin: '5px 0 0 0', fontSize: '24px' }}>
            {amount} <span style={{ color: '#fff', fontSize: '14px' }}>USDT</span>
          </h2>
        </div>

        {/* QR Code Section */}
        <div className="qr-container" style={{ textAlign: 'center', margin: '15px 0' }}>
          <div className="qr-frame" style={{ background: "#fff", padding: "10px", display: "inline-block", borderRadius: "8px" }}>
            <img
              src={qrSource}
              alt="Payment QR Code"
              style={{ width: '150px', height: '150px', display: 'block' }}
            />
          </div>
          <p style={{ color: '#f3ba2f', marginTop: '12px', fontSize: '12px', fontWeight: '500' }}>Scan QR Code to Pay</p>
        </div>

        {/* Wallet Address Card */}
        <div className="addr-card" style={{ background: '#16181d', padding: '12px', borderRadius: '12px' }}>
          <div className="addr-label" style={{ color: '#888', marginBottom: '8px', fontSize: '13px' }}>
            Network: <span style={{ color: '#f3ba2f', fontWeight: '600' }}>TRC20</span>
          </div>
          <div
            className="addr-input"
            onClick={copyAddress}
            style={{ background: '#000', display: 'flex', alignItems: 'center', padding: '12px', borderRadius: '8px', border: '1px solid #333', cursor: 'pointer' }}
          >
            <span
              className="addr-val"
              style={{ flex: 1, color: '#f3ba2f', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {config.trcAddress}
            </span>
            <FiCopy style={{ color: '#f3ba2f', fontSize: '16px', marginLeft: '10px' }} />
          </div>
        </div>

        {/* Notice Section */}
        <p className="final-notice" style={{ color: '#666', textAlign: 'center', fontSize: '11px', marginTop: '20px', lineHeight: '1.5' }}>
          Please ensure you are sending USDT via the TRC20 network. Sending any other asset may result in permanent loss of funds.
        </p>

        {/* Action Button */}
        <button 
          className="rk-btn-red-wide" 
          onClick={() => nav("/record")}
          style={{ background: '#f3ba2f', color: '#000', border: 'none', width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 'bold', marginTop: '20px', fontSize: '15px', cursor: 'pointer' }}
        >
          I Have Paid
        </button>
      </div>
    </div>
  );
}

const toastStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#f3ba2f",
  color: "#000",
  padding: "10px 30px",
  borderRadius: "30px",
  fontSize: "14px",
  fontWeight: "bold",
  zIndex: 10000,
  boxShadow: "0 8px 20px rgba(0,0,0,0.6)"
};