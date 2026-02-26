import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Added for translation
import { motion, AnimatePresence } from "framer-motion"; // Required for Loader
import { 
  FiArrowLeft, FiMail, FiMessageCircle, FiSend, FiMapPin, 
  FiCheckCircle, FiGlobe, FiX, FiTrendingUp, FiShield, 
  FiExternalLink, FiNavigation, FiInfo, FiLayers, FiCpu, FiLock, FiServer, FiAlertTriangle, FiAlertCircle
} from "react-icons/fi";
import "./about.css"; 
import RobotService from "./RobotService";
export default function About() {
  const { t } = useTranslation(); // Translation hook
  const nav = useNavigate();
  const autoScrollRef = useRef(null);
  const [activePopup, setActivePopup] = useState(null); 
  const [loading, setLoading] = useState(true); // Loader State
  
  const isHoldingRef = useRef(false);

  const offices = [
    { 
        id: 1, 
        name: t('office_1_name'), 
        desc: t('office_1_desc'), 
        img: "https://global.rakuten.com/corp/news/assets/img/press/20240115_New%20Ukraine%20Office.JPG" 
    },
    { 
        id: 2, 
        name: t('office_2_name'), 
        desc: t('office_2_desc'), 
        img: "https://i0.wp.com/rakuten.today/wp-content/uploads/2026/02/FY-2025-Q4-and-full-year-TNpng.png?fit=500%2C333&ssl=1" 
    },
    { 
        id: 3, 
        name: t('office_3_name'), 
        desc: t('office_3_desc'), 
        img: "https://i0.wp.com/rakuten.today/wp-content/uploads/2025/05/Viber-Philippines-1.jpg?fit=1024%2C682&ssl=1" 
    },
    { 
        id: 4, 
        name: t('office_4_name'), 
        desc: t('office_4_desc'), 
        img: "https://global.rakuten.com/corp/news/assets/img/media/modal/img_001.jpg" 
    },
    { 
        id: 5, 
        name: t('office_5_name'), 
        desc: t('office_5_desc'), 
        img: "https://assets.themuse.com/uploaded/companies/560/about_modules/91894/50ea3121-6301-4f83-bdb7-5b238e3cafdb.jpg" 
    },
    { 
        id: 6, 
        name: t('office_6_name'), 
        desc: t('office_6_desc'), 
        img: "https://pilbox.themuse.com/image.jpg?fmt=jpeg&w=900&h=900&q=90&mode=clip&pos=center&prog=1&url=https%3A%2F%2Fassets.themuse.com%2Fuploaded%2Fcompanies%2F560%2Fimage_modules%2F93556%2F00efa1c7-d7b0-4c62-85f7-03c8ec6f89b9.jpg" 
    },
  ];

  useEffect(() => {
    // --- ✅ IMAGE LOADING LOGIC (ONLY REMOVES LOADER WHEN IMAGES ARE READY) ---
    let loadedCount = 0;
    const totalImages = offices.length + 1; // +1 for the Map image at the bottom

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        setTimeout(() => setLoading(false), 1000); // Smooth exit
      }
    };

    // Preload Office Images
    offices.forEach((office) => {
      const img = new Image();
      img.src = office.img;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Don't get stuck if one image fails
    });

    // Preload Map Image
    const mapImg = new Image();
    mapImg.src = "https://global.rakuten.com/corp/about/assets/img/map/jp_jp_rch_en_pc.png";
    mapImg.onload = handleImageLoad;
    mapImg.onerror = handleImageLoad;

    const bottomNav = document.querySelector('nav, .bottom-nav, [class*="bottom-navigation"]'); 
    if (bottomNav) {
      bottomNav.style.setProperty('display', 'none', 'important');
    }

    const slider = autoScrollRef.current;
    if (!slider) return;
    let requestID;
    const scrollSpeed = 0.6; 

    const scroll = () => {
      if (!isHoldingRef.current) {
        slider.scrollLeft += scrollSpeed;
        if (slider.scrollLeft >= (slider.scrollWidth / 2)) {
          slider.scrollLeft = 0;
        }
      }
      requestID = requestAnimationFrame(scroll);
    };
    requestID = requestAnimationFrame(scroll);

    return () => {
        if (bottomNav) bottomNav.style.setProperty('display', 'flex', 'important');
        cancelAnimationFrame(requestID);
    };
  }, []);

  const handleOpenApp = () => {
    const links = {
        wa: "https://wa.me/your_number", 
      tg: "https://t.me/RgCustomerS12",
        ml: "mailto:support@rakuten-global.com"
    };
    window.open(links[activePopup], "_blank");
  };

  return (
    <div className="about-page-wrapper">
      <style>{`
        .premium-loader {
          width: 35px; height: 35px; border: 3px solid rgba(243, 156, 18, 0.2);
          border-radius: 50%; border-top-color: #f39c12;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ✅ LOADER OVERLAY (SAME AS HOME) */}
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

      <div className="about-header">
        <FiArrowLeft size={24} onClick={() => nav(-1)} className="back-icon" />
        <h2 className="header-title">{t('about_header_1')} <span className="gold-text">{t('about_header_2')}</span></h2>
      </div>

      <div className="scrollable-content no-scrollbar">
        {/* SECTION 1: SLIDER */}
        <div className="section-container first-section">
          <h3 className="section-label"><FiTrendingUp /> {t('institutional_ops')}</h3>
          <div 
            className="infinite-slider no-scrollbar" 
            ref={autoScrollRef}
            onMouseDown={() => { isHoldingRef.current = true; }} 
            onMouseUp={() => { isHoldingRef.current = false; }}
            onMouseLeave={() => { isHoldingRef.current = false; }}
            onTouchStart={() => { isHoldingRef.current = true; }}
            onTouchEnd={() => { isHoldingRef.current = false; }}
            style={{ 
              overflowX: 'auto', 
              cursor: 'pointer',
              userSelect: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {[...offices, ...offices].map((office, idx) => (
              <div key={idx} className="premium-glass-card">
                <div className="img-box">
                  <img src={office.img} alt={office.name} draggable="false" />
                </div>
                <div className="card-body">
                  <h4>{office.name}</h4>
                  <p>{office.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- INSTITUTIONAL FRAMEWORK SECTION --- */}
        <div className="content-block">
          <h3 className="gold-text"><FiLayers /> {t('mission_title')}</h3>
          <p className="body-text">
            {t('mission_p1')}
            <br/><br/>
            {t('mission_p2')}
          </p>
          
          <h3 className="gold-text mt-20"><FiCpu /> {t('infra_title')}</h3>
          <p className="body-text">{t('infra_subtitle')}</p>
          
          <div className="framework-grid">
            <div className="framework-item">
              <div className="framework-header">
                <FiCheckCircle className="green" /> 
                <span>{t('infra_point1_head')}</span>
              </div>
              <p className="sub-text">{t('infra_point1_sub')}</p>
            </div>

            <div className="framework-item">
              <div className="framework-header">
                <FiCheckCircle className="green" /> 
                <span>{t('infra_point2_head')}</span>
              </div>
              <p className="sub-text">{t('infra_point2_sub')}</p>
            </div>

            <div className="framework-item">
              <div className="framework-header">
                <FiLock className="green" /> 
                <span>{t('infra_point3_head')}</span>
              </div>
              <p className="sub-text">{t('infra_point3_sub')}</p>
            </div>

            <div className="framework-item">
              <div className="framework-header">
                <FiShield className="green" /> 
                <span>{t('infra_point4_head')}</span>
              </div>
              <p className="sub-text">{t('infra_point4_sub')}</p>
            </div>
          </div>
        </div>

        <div className="content-block">
          <h3 className="gold-text"><FiServer /> {t('ops_excellence_title')}</h3>
          <p className="body-text">{t('ops_excellence_subtitle')}</p>
          <ul className="professional-list">
            <li>{t('ops_list_1')}</li>
            <li>{t('ops_list_2')}</li>
            <li>{t('ops_list_3')}</li>
            <li>{t('ops_list_4')}</li>
          </ul>
          <p className="body-text italic">{t('ops_footer_italic')}</p>
        </div>

        {/* --- PROFESSIONAL SECURITY WARNING CARD --- */}
        <div className="scam-alert-card">
          <div className="scam-alert-header">
            <FiAlertTriangle className="scam-icon-main" />
            <div className="scam-title-group">
                <h3>{t('scam_warning_title')}</h3>
                <div className="scam-badge-red">{t('urgent_advisory')}</div>
            </div>
          </div>

          <p className="scam-intro-text">
            {t('scam_intro')}
          </p>

          <div className="scam-tips-container">
            <div className="scam-tip-box">
              <div className="tip-head">
                <FiGlobe className="tip-icon-gold" />
                <span>{t('security_tips_label')}</span>
              </div>
              
              <ul className="scam-points-list">
                <li>
                  {t('scam_tip_1_start')} <span className="url-highlight">Rakutnwin.com</span> {t('scam_tip_1_end')}
                </li>
                <li>{t('scam_tip_2')}</li>
                <li>{t('scam_tip_3')}</li>
                <li>{t('scam_tip_4')}</li>
                <li>{t('scam_tip_5')}</li>
              </ul>
            </div>
          </div>

          <div className="scam-footer-alert">
             <FiShield className="shield-icon-ok" />
             <p>{t('scam_footer_vigilant')}</p>
          </div>
        </div>

        {/* SECTION: REGISTERED HEADQUARTERS */}
        <div className="content-block">
          <h3 className="gold-text"><FiMapPin /> {t('hq_title')}</h3>
          <div className="official-map-wrapper">
            <img src="https://global.rakuten.com/corp/about/assets/img/map/jp_jp_rch_en_pc.png" alt="Rakuten Map" className="map-img-fixed" />
          </div>
          <div className="address-details">
            <p><b>{t('location_label')}:</b> {t('hq_address')}</p>
          </div>
        </div>

        {/* SECTION: SUPPORT */}
        <div className="support-section">
          <h3 className="section-label-center">{t('support_desk_title')}</h3>
          <div className="support-grid">
            <div className="support-tile wa" onClick={() => setActivePopup('wa')}>
              <FiMessageCircle size={28} />
              <span>{t('support_wa')}</span>
            </div>
            <div className="support-tile tg" onClick={() => setActivePopup('tg')}>
              <FiSend size={28} />
              <span>{t('support_tg')}</span>
            </div>
            <div className="support-tile ml" onClick={() => setActivePopup('ml')}>
              <FiMail size={28} />
              <span>{t('support_mail')}</span>
            </div>
          </div>
        </div>

        <div className="page-footer">
          <FiShield className="gold-text" /> <b>{t('footer_security_grade')}</b><br/>
          {t('footer_copy')}
          <div className="bottom-spacer"></div>
        </div>
      </div>
{!loading && <RobotService />}
      {activePopup && (
        <div className="modal-overlay" onClick={() => setActivePopup(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <FiX className="close-modal" onClick={() => setActivePopup(null)} />
            <div className={`modal-header-icon ${activePopup}`}>
              {activePopup === 'wa' && <FiMessageCircle />}
              {activePopup === 'tg' && <FiSend />}
              {activePopup === 'ml' && <FiMail />}
            </div>
            <h3>{t('modal_connect_title')}</h3>
            <p>
              {activePopup === 'wa' && t('modal_wa_desc')}
              {activePopup === 'tg' && t('modal_tg_desc')}
              {activePopup === 'ml' && t('modal_ml_desc')}
            </p>
            <button className="action-btn" onClick={handleOpenApp}>
                {t('modal_btn_text')} <FiExternalLink />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}