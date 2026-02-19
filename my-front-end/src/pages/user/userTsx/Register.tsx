import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios'; 
import '../userCss/Register.css';
import { AxiosError } from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // إرسال البيانات للباك-إيند
      const response = await api.post('auth/register', formData);
      console.log('تم التسجيل بنجاح:', response.data);
      
      // الانتقال لصفحة الـ OTP مع تمرير الهاتف
      navigate('/verify-otp', { state: { phone: formData.phone } });

    } catch (error: unknown) {
      const err = error as AxiosError<any>;
      const errorMessage = err.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      alert(errorMessage);
    }
  };

  return (
    <div className="app-container">
      {/* البار العلوي المنظم */}
      <nav className="top-navbar">
        <div className="logo">HORROR<span>FLIX</span></div>
        
        <div className="search-wrapper">
          <input type="text" placeholder="Search for a killer..." className="search-input" />
          <button className="search-btn">🔍</button>
        </div>

        {/* الزر الجديد فوق على اليسار */}
        <div className="nav-auth-actions">
          <button 
            type="button" 
            className="top-nav-login-btn" 
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </nav>

      <div className="main-content">
        <aside className="side-navbar">
          <div className="side-section">
            <h3>Categories</h3>
            <ul>
              <li className="active">All Movies</li>
              <li>Serial Killers</li>
              <li>Psychological</li>
              <li>Supernatural</li>
              <li>Classics</li>
            </ul>
          </div>
        </aside>

        <div className="register-container">
          <div className="register-card">
            <h2>إنشاء حساب جديد</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>اسم المستخدم</label>
                <input name="username" type="text" value={formData.username} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>رقم الهاتف</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>كلمة المرور</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>

              <button type="submit" className="register-button">تسجيل</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;