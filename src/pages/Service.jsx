import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiMessageCircle, FiSend } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./service.css";

export default function Service() {
  const nav = useNavigate();

  const handleLiveChat = () => {
    toast.info("Soon Will be added in your country", {
      position: "top-center",
      autoClose: 3000,
      theme: "dark",
    });
  };

  const handleTelegram = () => {
    // Apna Telegram link yahan dalein
   fetch("http://127.0.0.1:5000/api/cs-link")
  .then(r => r.json())
  .then(d => window.open(d.link || "#", "_blank"));
  };

  return (
    <div className="service-container">
      <ToastContainer />
      
      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="rocket">🚀</div>
        <div className="balloon">🎈</div>
        <div className="rocket">🚀</div>
        <div className="balloon">🎈</div>
      </div>

      {/* Header */}
      <div className="service-header">
        <FiChevronLeft className="back-icon" onClick={() => nav(-1)} />
        <span>Service Support</span>
      </div>

      <div className="service-content">
        <div className="support-card">
          <div className="icon-wrapper">
            <FiMessageCircle className="main-icon" />
          </div>
          <h2>Customer Service</h2>
          <p>Our team is available 24/7 to assist you with any inquiries or issues.</p>
          
          <div className="button-group">
            <button className="btn-live" onClick={handleLiveChat}>
              <FiMessageCircle /> Live Chat
            </button>
            
            <button className="btn-telegram" onClick={handleTelegram}>
              <FiSend /> Telegram Support
            </button>
          </div>
        </div>

        <div className="info-footer">
          <p>Typically responds within 1-5 minutes</p>
        </div>
      </div>
    </div>
  );
}