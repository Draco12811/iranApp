import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiAlertCircle, FiInfo, FiClipboard } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Wallet() {

  const [address, setAddress] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();
  const inputRef = useRef(null);

  // ✅ GET USER (FIXED)
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?.id;

  // ================= LOAD WALLET FROM SERVER =================
  useEffect(() => {

    const loadWallet = async () => {

      if (!userId) {
        toast.error("Session expired. Please login again");
        nav("/login");
        return;
      }

      try {

        const res = await fetch(
          `https://iran-backend.onrender.com0/api/user/wallet/${userId}`
        );

        const data = await res.json();

        // ✅ IF ADMIN ALREADY BOUND
        if (data.walletAddress) {
          setAddress(data.walletAddress);
          setIsLocked(true);
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to load wallet");
      }

      setLoading(false);
    };

    loadWallet();

  }, [userId, nav]);

  // ================= AUTO FONT =================
  const getAutoFontSize = (text) => {
    const len = (text || "").length;
    if (len <= 28) return "14px";
    if (len <= 34) return "13px";
    if (len <= 42) return "12px";
    if (len <= 55) return "11px";
    return "10px";
  };

  // ================= PASTE =================
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setAddress(text.trim());
    } catch {
      toast.info("Paste manually");
    }
  };

  // ================= BIND WALLET =================
  const handleBind = async () => {

    if (!address) return toast.error("Please enter your wallet address");

    if (!userId) {
      toast.error("Session expired. Please login again");
      return;
    }

    try {

      const res = await fetch(
        "https://iran-backend.onrender.com0/api/user/bind-wallet",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            walletAddress: address
          })
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Bind failed");
        return;
      }

      toast.success("Wallet address bound successfully!");
      setIsLocked(true);

    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="rk-page-fixed" style={{ background: '#0b0b0b', minHeight: '100vh', color: '#fff' }}>

      <ToastContainer theme="dark" position="top-center" autoClose={2000} />

      {loading ? (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#0b0b0b'
        }}>
          Loading...
        </div>
      ) : (

        <>
          <div style={{ display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #1a1a1a' }}>
            <FiChevronLeft style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => nav(-1)} />
            <span style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: '600', marginRight: '24px' }}>
              Bind Wallet
            </span>
          </div>

          <div style={{ padding: '20px' }}>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ color: '#888', fontSize: '13px', display: 'block', marginBottom: '10px' }}>
                USDT (TRC20) Address
              </label>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={address}
                  onChange={(e) => !isLocked && setAddress(e.target.value)}
                  readOnly={isLocked}
                  placeholder="Paste your address here..."
                  style={{
                    width: '100%',
                    padding: '16px 80px 16px 16px',
                    background: isLocked ? '#16181d' : '#000',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: isLocked ? '#666' : '#f3ba2f',
                    fontSize: getAutoFontSize(address),
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                />

                {!isLocked && (
                  <button onClick={handlePaste}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      width: '42px',
                      height: '32px',
                      background: 'rgba(243,186,47,0.15)',
                      border: '1px solid #f3ba2f',
                      color: '#f3ba2f',
                      borderRadius: '8px'
                    }}>
                    <FiClipboard />
                  </button>
                )}
              </div>
            </div>

            {!isLocked ? (

              <button onClick={handleBind}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#f3ba2f',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000',
                  fontWeight: 'bold'
                }}>
                Bind Address
              </button>

            ) : (

              <button onClick={() => nav("/service")}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#222',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  color: '#888'
                }}>
                Contact Customer Service
              </button>

            )}

          </div>
        </>
      )}

    </div>
  );
}