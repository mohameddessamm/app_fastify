import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "../userCss/Register.css";
import { AxiosError } from "axios";
import MovieList from "../../movies/MovieList";

const Register = () => {
  const navigate = useNavigate();
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // إرسال البيانات كاملة (الاسم، الايميل، الباسورد، الهاتف)
      await api.post("auth/register", formData);
      navigate("/verify-otp", { state: { phone: formData.phone } });
    } catch (error: unknown) {
      const err = error as AxiosError<any>;
      alert(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
    }
  };

  return (
    <div className="app-container">
      <nav className="top-navbar">
        <div className="logo">
          HORROR<span>FLIX</span>
        </div>
        <div className="nav-auth-actions">
          <button
            className={`top-nav-btn ${showRegisterForm ? "active-btn" : ""}`}
            onClick={() => setShowRegisterForm(!showRegisterForm)}
          >
            Registe
          </button>
          <button
            className="top-nav-btn login-style"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      <div className="main-content">
        <div className={`movies-background ${showRegisterForm ? "blur" : ""}`}>
          <MovieList />
        </div>

        {showRegisterForm && (
          <div className="register-overlay" dir="rtl">
            <div className="register-card fade-in">
              <button
                className="close-btn"
                onClick={() => setShowRegisterForm(false)}
              >
                ✖
              </button>
              <h2>إنشاء حساب جديد</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>اسم المستخدم</label>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="مثال: Ahmed123"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@mail.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>كلمة المرور</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    required
                  />
                </div>

                <button type="submit" className="register-button">
                  إنشاء الحساب
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
