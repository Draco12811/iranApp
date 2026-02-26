import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";

// --- User Pages ---
import Login from "./pages/Login";
import Register from "./pages/Register";
import Mine from "./pages/Mine";
import Settings from "./pages/Settings";
import Grab from "./pages/Grab"; // <--- Aapka naya Grab file
import Home from "./pages/Home"; // (Inko ensure karein ke ye files exist karti hain)
import Service from "./pages/Service"; 
import Record from "./pages/Record"; 
import LuckyDraw from "./pages/LuckyDraw";
import LuckySpin from "./pages/LuckySpin";
import Deposit from "./pages/Deposit";
import Wallet from "./pages/Wallet";
import Withdrawal from "./pages/Withdrawal";

// --- Admin Pages ---
import AdminDashboard from "./admin/Dashboard"; 
import PaymentInfo from "./pages/PaymentInfo";
// 🛠️ Layout Wrapper: Admin aur Auth pages par BottomNav nahi dikhayega
function LayoutWrapper({ children }) {
  const location = useLocation();
  
  // In pages par BottomNav CHUPANA (Hide) hai
  const hideNav = 
    location.pathname.startsWith("/admin") || 
    location.pathname === "/login" || 
    location.pathname === "/register" ||
    location.pathname === "/settings" ||
  location.pathname === "/wallet" ||
  location.pathname === "/withdraw" ||
  location.pathname === "/deposit"||
    location.pathname === "/";

  return (
    <>
      <div className="main-app-content" style={{ paddingBottom: hideNav ? "0px" : "80px" }}>
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* 🔐 AUTH ROUTES */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<Route path="/wallet" element={<Wallet />} />
          {/* 📱 MAIN APP ROUTES (BottomNav working here) */}
          <Route path="/home" element={<Home />} />
          <Route path="/service" element={<Service />} />
          <Route path="/grab" element={<Grab />} />
          <Route path="/record" element={<Record />} />
          <Route path="/mine" element={<Mine />} />
          <Route path="/payment-info" element={<PaymentInfo />} />
          {/* OTHER PAGES */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/luckydraw" element={<LuckyDraw />} />
          <Route path="/luckyspin" element={<LuckySpin />} />



<Route path="/withdraw" element={<Withdrawal />} />
<Route path="/deposit" element={<Deposit />} />
          {/* 👑 ADMIN ROUTES */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}