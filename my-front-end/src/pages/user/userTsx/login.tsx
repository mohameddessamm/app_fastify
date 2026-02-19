import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios'; 
import '../userCss/Register.css'; // سنستخدم نفس ملف التنسيق للتوحيد
import { AxiosError } from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🚀 إرسال الطلب للباك إيند (loginHandler)
      const response = await api.post('/auth/login', formData);
      
      console.log('Login Success:', response.data);
      
      // تخزين بيانات المستخدم (اختياري حسب حاجتك في الـ Context)
      const { role } = response.data.user;

      // توجيه المستخدم بناءً على رتبته (Role)
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }

    } catch (error: unknown) {
      const err = error as AxiosError<any>;
      const errorMessage = err.response?.data?.message || 'خطأ في البريد أو كلمة المرور';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="top-navbar">
        <div className="logo">HORROR<span>FLIX</span></div>
        <div className="nav-auth-actions">
          <button className="top-nav-login-btn" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </nav>

      <div className="main-content">
        <div className="register-container" style={{ justifyContent: 'center', paddingRight: '0' }}>
          <div className="register-card">
            <h2>تسجيل الدخول</h2>
            <form onSubmit={handleSubmit}>
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

              <button type="submit" className="register-button" disabled={loading}>
                {loading ? 'جاري التحقق...' : 'دخول'}
              </button>
            </form>
            
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#888' }}>
              ليس لديك حساب؟ <span 
                style={{ color: '#e50914', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => navigate('/register')}
              >
                إنشاء حساب جديد
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;