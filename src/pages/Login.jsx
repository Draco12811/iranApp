import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff, Globe, X } from "lucide-react";
import "../auth.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanUsername = form.username.trim().toLowerCase().replace(/\s+/g, "");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/login", {
        username: cleanUsername,
        password: form.password
      });

      localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
localStorage.setItem("userName", res.data.user.username);   // ⭐ ADD THIS
      await Swal.fire({
        icon: "success", title: "Access Granted", background: "#111", color: "#fff", showConfirmButton: false, timer: 1000,
      });

      navigate("/mine", { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error", title: "Denied", text: err.response?.data?.message || "Invalid credentials", background: "#111", color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>RAKUTEN</h1>
          <span>Member Login</span>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input type="text" placeholder="Username" required value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="input-group password-wrapper">
            <input type={showPassword ? "text" : "password"} placeholder="Password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <span className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
        <div className="auth-footer" style={{ textAlign: "center", marginTop: "15px" }}>
          New here? <span onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "#f39c12" }}>Register Now</span>
        </div>
      </div>
    </div>
  );
}