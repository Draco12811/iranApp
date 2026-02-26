import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiShield,
  FiFileText,
  FiUserCheck,
  FiTrendingUp,
  FiLock,
  FiGlobe,
  FiX,
  FiCpu,
  FiAward,
  FiActivity,
  FiDownload,
  FiUpload,
  FiBookOpen,
  FiHelpCircle,
  FiPieChart
} from "react-icons/fi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "./about.css";

const certImg = "https://image2url.com/r2/default/images/1769313887277-021f6c13-da40-4450-88cd-9c0173c27999.jpg";

export default function Home() {
  const nav = useNavigate();

  const [liveStats, setLiveStats] = useState({
    user: "Rakuten**09",
    amount: "2345.40"
  });

  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimer = setTimeout(() => setLoading(false), 1500);

    const interval = setInterval(() => {
      const users = [
        "Alex**21", "Zack**", "Sara**44", "King**", "Rich**77", "User**", "Rakuten**09", "Liam**",
        "Noah**18", "Emma**", "Olivia**55", "Ava**", "Sophia**11", "Mason**", "Logan**25", "Ethan**",
        "Lucas**14", "Isabella**", "Mia**29", "Amelia**", "Harper**04", "Evelyn**", "Abigail**36",
        "Emily**", "Ella**72", "Avery**", "Sofia**05", "Benjamin**66", "Elijah**", "James**13",
        "William**", "Henry**08", "Daniel**", "Michael**97", "Sebastian**", "Jack**48", "Owen**",
        "Hiro**61", "Yuki**", "Sora**63", "Kenji**", "Aiko**27", "Mei**", "Jun**14", "Riku**",
        "Ren**36", "Hana**", "Arjun**18", "Ayaan**", "Rohan**22", "Kabir**", "Ishaan**03", "Zara**",
        "Aditi**82", "Diya**", "Anaya**12", "Reyansh**", "Ahmed**67", "Omar**", "Yusuf**26",
        "Hassan**", "Ali**99", "Fatima**", "Aisha**82", "Zain**", "Maryam**33", "Khalid**",
        "Ivan**52", "Mikhail**", "Dmitry**39", "Anastasia**", "Nikolai**13", "Viktor**", "Elena**24",
        "Sergey**", "Olga**06", "Carlos**44", "Mateo**", "Diego**28", "Santiago**", "Valentina**66",
        "Camila**", "Lucia**71", "Emilia**", "Andres**90", "Maria**", "Pierre**47", "Hugo**",
        "Louis**09", "Chloe**", "Amelie**21", "Luca**", "Marco**53", "Giulia**", "Eva**66",
        "Nina**", "Lars**", "Freya**71", "Bjorn**", "Ingrid**05", "Yuna**", "Kaito**88"
      ];

      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomAmount = (Math.random() * (5000 - 100) + 100).toFixed(2);
      setLiveStats({ user: randomUser, amount: randomAmount });
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(loadTimer);
    };
  }, []);

  return (
    <div
      className="home-container"
      style={{
        background: "#030303",
        color: "#ffffff",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        paddingBottom: "100px",
        height: "100vh",
        overflowY: "auto"
      }}
    >
      <style>{`
        div.home-container {
          background: radial-gradient(circle at top left, #3d0000 0%, #1a0000 40%, #030303 100%) !important;
        }
        #header { background: transparent !important; }
        body { overflow: hidden !important; }
        .home-container::-webkit-scrollbar { display: none; }
        .home-container { -ms-overflow-style: none; scrollbar-width: none; }
        .modal-scroll-area::-webkit-scrollbar { display: none; }
        .modal-scroll-area { -ms-overflow-style: none; scrollbar-width: none; }
        .premium-loader {
          width: 35px; height: 35px; border: 3px solid rgba(243, 156, 18, 0.2);
          border-radius: 50%; border-top-color: #f39c12;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "#000", zIndex: 9999,
              display: "flex", justifyContent: "center", alignItems: "center"
            }}
          >
            <div className="premium-loader"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1: MODAL SYSTEM */}
      <section id="modals">
        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
                zIndex: 3000, display: "flex", alignItems: "center",
                justifyContent: "center", padding: "25px"
              }}
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
                style={{
                  background: "#111", borderRadius: "18px", width: "92%",
                  maxWidth: "360px", border: "1px solid #333", overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.8)", maxHeight: "78vh",
                  display: "flex", flexDirection: "column"
                }}
              >
                <div style={{
                  padding: "12px 18px", background: "#1a1a1a", display: "flex",
                  justifyContent: "space-between", alignItems: "center",
                  borderBottom: "1px solid #222", position: "sticky", top: 0, zIndex: 10
                }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", letterSpacing: "1px", color: "#f39c12" }}>
                    SYSTEM VERIFIED
                  </span>
                  <FiX onClick={() => setActiveModal(null)} style={{ cursor: "pointer", fontSize: "1.2rem", color: "#888" }} />
                </div>

                <div className="modal-scroll-area" style={{ padding: activeModal === "official" ? "15px" : "22px 18px", textAlign: "center", overflowY: "auto", flex: 1 }}>
                  
                  {activeModal === "boost" && (
                    <div>
                      <FiTrendingUp size={45} color="#ff4444" style={{ marginBottom: "15px" }} />
                      <h2 style={{ fontSize: "1.2rem", marginBottom: "12px", color: "#fff" }}>Task Boosting Engine</h2>
                      <div style={{ fontSize: "0.82rem", color: "#bbb", lineHeight: "1.55", textAlign: "left" }}>
                        <p>The Task Boosting Engine optimizes your task allocation based on market demand.</p>
                        <p style={{ marginBottom: "10px", color: "#f39c12", fontWeight: "bold" }}>Key Highlights</p>
                        <p>• Faster processing speeds</p>
                        <p>• Higher priority task access</p>
                        <p>• Maximized profit margins</p>
                        <p>• Real-time demand tracking</p>
                        <p>• Automated performance audit</p>
                        <p style={{ marginTop: "12px", color: "#888" }}>Boosting is active by default for all registered accounts.</p>
                      </div>
                      <button onClick={() => setActiveModal(null)} style={{ width: "100%", padding: "14px", background: "linear-gradient(to right, #ff3333, #bb0000)", border: "none", color: "#fff", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer", marginTop: "15px", borderRadius: "8px" }}>
                        CONFIRM
                      </button>
                    </div>
                  )}

                  {activeModal === "strategy" && (
                    <div>
                      <FiCpu size={45} color="#ff3333" style={{ marginBottom: "15px" }} />
                      <h2 style={{ fontSize: "1.2rem", marginBottom: "12px", color: "#fff" }}>Global Order Flow</h2>
                      <p style={{ fontSize: "0.85rem", color: "#999", lineHeight: "1.5", textAlign: "justify" }}>
                        Our platform connects with global e-commerce merchants to route high-frequency orders. 
                        By utilizing decentralized user processing, we ensure that brands achieve the visibility and sales volume required for marketplace rankings.
                        <br /><br />
                        Users act as processing nodes, confirming transactions that help simulate organic growth for partner brands.
                      </p>
                      <button onClick={() => setActiveModal(null)} style={{ width: "100%", padding: "14px", background: "linear-gradient(to right, #ff3333, #bb0000)", border: "none", color: "#fff", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer", marginTop: "15px", borderRadius: "8px" }}>
                        CONFIRM
                      </button>
                    </div>
                  )}

                  {activeModal === "security" && (
                    <div>
                      <FiLock size={45} color="#3399ff" style={{ marginBottom: "15px" }} />
                      <h2 style={{ fontSize: "1.2rem", marginBottom: "12px", color: "#fff" }}>Capital Protection Protocol</h2>
                      <p style={{ fontSize: "0.85rem", color: "#999", lineHeight: "1.5", textAlign: "justify" }}>
                        We utilize a multi-layered encryption protocol to safeguard all user funds. Your capital is insured through our institutional liquidity pool, ensuring 100% solvency at all times.
                      </p>
                      <button onClick={() => setActiveModal(null)} style={{ width: "100%", padding: "14px", background: "linear-gradient(to right, #ff3333, #bb0000)", border: "none", color: "#fff", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer", marginTop: "15px", borderRadius: "8px" }}>
                        SECURE ACCESS
                      </button>
                    </div>
                  )}

                  {activeModal === "official" && (
                    <div style={{ width: "100%" }}>
                      <div style={{ background: "#fff", borderRadius: "2px", padding: "1px", marginBottom: "-12px" }}>
                        <img src={certImg} alt="Official Registration" style={{ width: "100%", borderRadius: "6px", display: "block" }} />
                      </div>
                      <h2 style={{ fontSize: "1.1rem", marginBottom: "1px", color: "#fff" }}>Institutional Compliance</h2>
                      <div style={{ background: "#000", padding: "10px", borderRadius: "8px", border: "1px solid #222" }}>
                        <p style={{ fontSize: "0.75rem", color: "#f39c12", fontWeight: "bold", margin: "0 0 3px 0" }}>✓ UK Registered Entity</p>
                        <p style={{ fontSize: "0.7rem", color: "#aaa", lineHeight: "1.3", margin: 0 }}>
                          Registration No: <b>291119TT8</b>. <br />
                          Verified under institutional trade standards.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeModal === "manual" && (
                    <div style={{ textAlign: "left" }}>
                      <h2 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#fff", textAlign: "center" }}>User Working Manual</h2>
                      <div style={{ fontSize: "0.8rem", color: "#bbb", lineHeight: "1.6" }}>
                        <p><b>• Step 1: Deposit</b><br />Add USDT to your balance to start tasks.</p>
                        <p><b>• Step 2: Processing</b><br />Head to the task area to grab daily orders.</p>
                        <p><b>• Step 3: Commission</b><br />Earn fixed profits for every successfully completed order.</p>
                        <p><b>• Step 4: Level Up</b><br />Increase your VIP level for higher commission rates.</p>
                        <p><b>• Step 5: Withdraw</b><br />Withdraw your profits directly to your TRC20 wallet.</p>
                        <p style={{ color: "#888" }}><b>Note:</b> Please follow all community guidelines.</p>
                      </div>
                      <button onClick={() => setActiveModal(null)} style={{ width: "100%", padding: "14px", background: "#f39c12", border: "none", color: "#000", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer", marginTop: "15px", borderRadius: "8px" }}>
                        UNDERSTOOD
                      </button>
                    </div>
                  )}

                  {activeModal === "faq" && (
                    <div style={{ textAlign: "left" }}>
                      <h2 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#fff", textAlign: "center" }}>Platform FAQ</h2>
                      <div style={{ fontSize: "0.8rem", color: "#bbb", lineHeight: "1.6" }}>
                        <p style={{ color: "#f39c12", marginBottom: "2px" }}>What is Rakuten Global?</p>
                        <p style={{ marginBottom: "10px" }}>A high-frequency order routing platform.</p>
                        <p style={{ color: "#f39c12", marginBottom: "2px" }}>How do I earn?</p>
                        <p style={{ marginBottom: "10px" }}>Complete tasks to receive commissions from merchants.</p>
                        <p style={{ color: "#f39c12", marginBottom: "2px" }}>What is the minimum withdrawal?</p>
                        <p style={{ marginBottom: "10px" }}>The minimum withdrawal is $10 USDT.</p>
                        <p style={{ color: "#f39c12", marginBottom: "2px" }}>How long does deposit take?</p>
                        <p style={{ marginBottom: "10px" }}>Deposits are usually processed within 1-5 minutes.</p>
                        <p style={{ color: "#f39c12", marginBottom: "2px" }}>Is my data safe?</p>
                        <p>Yes, we use bank-level encryption protocols.</p>
                      </div>
                      <button onClick={() => setActiveModal(null)} style={{ width: "100%", padding: "14px", background: "#f39c12", border: "none", color: "#000", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer", marginTop: "15px", borderRadius: "8px" }}>
                        CLOSE
                      </button>
                    </div>
                  )}

                  {activeModal === "earnings" && (
                    <div style={{ textAlign: "left" }}>
                      <h2 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#fff", textAlign: "center" }}>How Platform Earns</h2>
                      <div style={{ fontSize: "0.8rem", color: "#bbb", lineHeight: "1.6" }}>
                        <p>The platform generates revenue through three main streams:</p>
                        <p><b>• Merchant Benefit:</b> Brands pay us for data volume and ranking improvements.</p>
                        <p><b>• Variable Commissions:</b> Small processing fees on high-frequency trades.</p>
                        <p><b>• Shared Revenue:</b> Partnership deals with global e-commerce giants.</p>
                      </div>
                      <button onClick={() => setActiveModal(null)} style={{ width: "100%", padding: "14px", background: "#f39c12", border: "none", color: "#000", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer", marginTop: "15px", borderRadius: "8px" }}>
                        DONE
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SECTION 2: TOP HEADER (Notification Icon Removed) */}
      <section id="header">
        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.4rem", fontWeight: "900", letterSpacing: "-0.5px" }}>
            RAKUTEN <span style={{ color: "#f39c12" }}>GLOBAL</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ border: "1px solid #e68e09", color: "#21c779", padding: "3px 10px", borderRadius: "5px", fontSize: "0.7rem", fontWeight: "0.8" }}>
              ONLINE
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HERO SLIDER */}
      <section id="slider">
        <div style={{ padding: "0 15px" }}>
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000 }} pagination={{ clickable: true }} className="main-swiper" style={{ borderRadius: "15px", height: "170px" }}>
            <SwiperSlide onClick={() => setActiveModal("boost")}>
              <div style={{ background: "linear-gradient(135deg, #440000 0%, #110000 100%)", height: "100%", padding: "20px", position: "relative", border: "1px solid #300", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "5px" }}>Task Boosting Engine</h2>
                <p style={{ fontSize: "0.75rem", color: "#ccc", marginBottom: "10px" }}>Accelerate your earnings with our high-speed engine.</p>
                <button style={{ background: "#ff3333", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "6px", fontWeight: "bold", fontSize: "0.7rem", alignSelf: "flex-start" }}>MECHANISM</button>
              </div>
            </SwiperSlide>
            <SwiperSlide onClick={() => setActiveModal("security")}>
              <div style={{ background: "linear-gradient(135deg, #001a33 0%, #000000 100%)", height: "100%", padding: "20px", position: "relative", border: "1px solid #002244", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "5px" }}>Asset Protection</h2>
                <p style={{ fontSize: "0.75rem", color: "#ccc", marginBottom: "10px" }}>Your funds are protected by institutional insurance.</p>
                <button style={{ background: "#3399ff", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "6px", fontWeight: "bold", fontSize: "0.7rem", alignSelf: "flex-start" }}>SECURITY</button>
              </div>
            </SwiperSlide>
            <SwiperSlide onClick={() => setActiveModal("official")}>
              <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #000 100%)", height: "100%", padding: "20px", border: "1px solid #333", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "5px" }}>UK Certified</h2>
                <p style={{ fontSize: "0.75rem", color: "#ccc", marginBottom: "10px" }}>Registered and compliant with trade regulations.</p>
                <button style={{ background: "#f39c12", color: "#000", border: "none", padding: "8px 15px", borderRadius: "6px", fontWeight: "bold", fontSize: "0.7rem", alignSelf: "flex-start" }}>LICENSE</button>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* SECTION 4: QUICK ACTIONS */}
      <section id="actions">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", padding: "25px 15px" }}>
          <div onClick={() => nav("/deposit")} style={{ textAlign: "center" }}>
            <div style={{ background: "#111", height: "55px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", border: "1px solid #222" }}>
              <FiDownload color="#00ff88" size={22} />
            </div>
            <span style={{ fontSize: "0.7rem", color: "#888", fontWeight: "600" }}>Deposit</span>
          </div>
          <div onClick={() => nav("/withdraw")} style={{ textAlign: "center" }}>
            <div style={{ background: "#111", height: "55px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", border: "1px solid #222" }}>
              <FiUpload color="#ff3333" size={22} />
            </div>
            <span style={{ fontSize: "0.7rem", color: "#888", fontWeight: "600" }}>Withdraw</span>
          </div>
          <div onClick={() => setActiveModal("manual")} style={{ textAlign: "center" }}>
            <div style={{ background: "#111", height: "55px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", border: "1px solid #222" }}>
              <FiBookOpen color="#f39c12" size={22} />
            </div>
            <span style={{ fontSize: "0.7rem", color: "#888", fontWeight: "600" }}>Manual</span>
          </div>
          <div onClick={() => setActiveModal("faq")} style={{ textAlign: "center" }}>
            <div style={{ background: "#111", height: "55px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", border: "1px solid #222" }}>
              <FiHelpCircle color="#3399ff" size={22} />
            </div>
            <span style={{ fontSize: "0.7rem", color: "#888", fontWeight: "600" }}>FAQ</span>
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE UPDATES */}
      <section id="live-updates">
        <div style={{ margin: "0 15px", background: "#0a0a0a", padding: "12px 15px", borderRadius: "12px", border: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "12px" }}>
          <FiActivity color="#00ff88" size={16} />
          <div style={{ fontSize: "0.8rem", color: "#eee" }}>
            Member <b style={{ color: "#fff" }}>{liveStats.user}</b> processed{" "}
            <span style={{ color: "#00ff88", fontWeight: "bold" }}>{liveStats.amount} USDT</span>
          </div>
        </div>
      </section>

      {/* SECTION 6: INSTITUTIONAL ECOSYSTEM & ABOUT US */}
      <section id="ecosystem">
        <div style={{ padding: "25px 15px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "15px", letterSpacing: "0.5px" }}>Institutional Ecosystem</h3>
          
          <div onClick={() => setActiveModal("earnings")} style={{ background: "#111", padding: "18px", borderRadius: "15px", display: "flex", gap: "15px", marginBottom: "12px", border: "1px solid #1a1a1a", cursor: "pointer" }}>
            <FiPieChart size={24} color="#f39c12" />
            <div>
              <h4 style={{ margin: "0 0 5px 0", fontSize: "0.95rem", color: "#fff" }}>How Platform Earns</h4>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#666", lineHeight: "1.4" }}>Learn about our revenue streams and stability.</p>
            </div>
          </div>

          <div onClick={() => setActiveModal("strategy")} style={{ background: "#111", padding: "18px", borderRadius: "15px", display: "flex", gap: "15px", marginBottom: "12px", border: "1px solid #1a1a1a", cursor: "pointer" }}>
            <FiGlobe size={24} color="#3399ff" />
            <div>
              <h4 style={{ margin: "0 0 5px 0", fontSize: "0.95rem", color: "#fff" }}>Global Order Flow</h4>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#666", lineHeight: "1.4" }}>Our strategy for global market integration.</p>
            </div>
          </div>

          <div onClick={() => nav("/about")} style={{ background: "#111", padding: "18px", borderRadius: "15px", display: "flex", gap: "15px", marginBottom: "12px", border: "1px solid #1a1a1a", cursor: "pointer" }}>
            <FiFileText size={24} color="#f39c12" />
            <div>
              <h4 style={{ margin: "0 0 5px 0", fontSize: "0.95rem", color: "#fff" }}>About Us</h4>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#666", lineHeight: "1.4" }}>Read more about Rakuten Global mission.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}