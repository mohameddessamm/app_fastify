import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./LoginAdmin.css";

const LoginAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // نستخدم نفس مسار الـ login في الباك-إيند لأنه ذكي ويعرف الـ role
      const response = await api.post("/auth/login", formData);

      const { role, username } = response.data.user;

      if (role === "ADMIN") {
        alert(`مرحباً سيادة المدير: ${username}`);
        navigate("/admin/dashboard"); // التوجه للوحة التحكم
      } else {
        alert("عذراً، هذا المدخل مخصص للمديرين فقط.");
        navigate("/login"); // إذا كان يوزر عادي نرجعه لصفحة اليوزر
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-badge">ADMIN ONLY</div>
        <div className="logo">
          HORROR<span>FLIX</span>
        </div>
        <h3>تسجيل دخول الإدارة</h3>
        <p>الرجاء إدخال بيانات الاعتماد للوصول للنظام</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>البريد الإلكتروني للمدير</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              placeholder="admin@horrorflix.com"
            />
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "جاري التحقق..." : "دخول لوحة التحكم"}
          </button>
        </form>

        <div className="footer-note">نظام إدارة المحتوى المحمي © 2026</div>
      </div>
    </div>
  );
};

export default LoginAdmin;
