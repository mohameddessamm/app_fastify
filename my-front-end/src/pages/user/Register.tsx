import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // أضفنا Link هنا
import api from '../../api/axios'; 
import './Register.css';
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
      // تم تحديث المسار ليتناسب مع الباك-إيند الجديد
      const response = await api.post('/auth/register', formData);
      console.log('تم التسجيل بنجاح:', response.data);
      
      // الانتقال لصفحة الـ OTP مع تمرير رقم الهاتف
      navigate('/verify-otp', { state: { phone: formData.phone } });

    } catch (error: unknown) {
      const err = error as AxiosError<any>;
      console.error('فشل التسجيل:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      alert(errorMessage);
    }
  };

  return (
    <div className="app-container">
      {/* البار العلوي */}
      <nav className="top-navbar">
        <div className="logo">HORROR<span>FLIX</span></div>
        <div className="search-wrapper">
          <input type="text" placeholder="Search for a killer..." className="search-input" />
          <button className="search-btn">🔍</button>
        </div>
      </nav>

      <div className="main-content">
        {/* القائمة الجانبية */}
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

        {/* نموذج التسجيل */}
        <div className="register-container">
          <div className="register-card">
            <h2>إنشاء حساب جديد</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>اسم المستخدم</label>
                <input 
                  name="username" 
                  type="text" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  placeholder="ادخل اسمك"
                />
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="email@example.com"
                />
              </div>

              <div className="form-group">
                <label>رقم الهاتف</label>
                <input 
                  name="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  placeholder="+201234567890"
                />
              </div>

              <div className="form-group">
                <label>كلمة المرور</label>
                <input 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="register-button">تسجيل</button>
            </form>

            {/* الجزء الجديد: زر الانتقال لصفحة تسجيل الدخول */}
            <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ color: '#aaa', fontSize: '14px' }}>
                لديك حساب بالفعل؟ 
                <button 
                  onClick={() => navigate('/login')} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e50914',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginLeft: '5px',
                    textDecoration: 'underline'
                  }}
                >
                  تسجيل الدخول
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;