import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import "../auth.css";

export default function Register() {

  const navigate = useNavigate();

  // 🔒 FIXED INVITE CODE
  const FIXED_INVITE = "129001";

  const [form, setForm] = useState({
    username: "",
    password: "",
    verifyInput: ""
  });

  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== CAPTCHA =====
  const generateCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptcha(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // ===== REGISTER =====
  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    // CAPTCHA CHECK
    if (form.verifyInput !== captcha) {
      generateCaptcha();
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid Captcha",
        background: "#111",
        color: "#fff"
      });
    }

    setLoading(true);

    try {

      await axios.post("https://iran-backend.onrender.com/.../api/auth/register", {
        username: form.username.trim().toLowerCase(),
        password: form.password,
        inviteCode: FIXED_INVITE
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account Created!",
        background: "#111",
        color: "#fff",
        showConfirmButton: false,
        timer: 1500
      });

      navigate("/login");

    } catch (err) {

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Error",
        background: "#111",
        color: "#fff"
      });

      generateCaptcha();

    } finally {
      setLoading(false);
    }
  };

  // ===== UI =====
  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-header">
          <h1>RAKUTEN</h1>
          <span>Create Account</span>
        </div>

        <form onSubmit={handleRegister}>

          {/* USERNAME */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              required
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <span
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* 🔒 FIXED INVITE CODE */}
          <div className="input-group">
            <input
              type="text"
              value={FIXED_INVITE}
              readOnly
              className="invite-input"
            />
          </div>

          {/* CAPTCHA */}
          <div className="input-group verify-container">
            <input
              type="text"
              placeholder="Verify Code"
              required
              value={form.verifyInput}
              onChange={(e) =>
                setForm({ ...form, verifyInput: e.target.value })
              }
            />

            <div
              className="captcha-box"
              onClick={generateCaptcha}
            >
              {captcha}
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Register"}
          </button>

        </form>

      </div>
    </div>
  );
}