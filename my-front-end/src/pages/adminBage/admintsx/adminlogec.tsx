import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios'; 
import '../admincss/AdminSetup.css';
import { AxiosError } from 'axios';

const CreateRootAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    adminKey: '' // المفتاح السري المطلوب في الهيدر
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/admin/create-root-admin', 
        { 
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        },
        {
          headers: {
            'x-admin-key': formData.adminKey // إرسال المفتاح في الهيدر كما يطلب الباك إيند
          }
        }
      );

      alert(response.data.message);
      navigate('/admin-login'); // التوجه لتسجيل الدخول بعد النجاح

    } catch (error: unknown) {
      const err = error as AxiosError<any>;
      const errorMessage = err.response?.data?.message || 'فشلت العملية';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="login-content"> {/* استخدمنا نفس كلاسات التوسيط */}
        <div className="register-card" style={{ borderColor: '#e50914', borderStyle: 'dashed' }}>
          <h2 style={{ color: '#e50914' }}>ROOT ADMIN SETUP</h2>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginBottom: '20px' }}>
            مسار إنشاء المدير الرئيسي للنظام (يُستخدم لمرة واحدة)
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>SECRET ADMIN KEY</label>
              <input 
                name="adminKey" 
                type="password" 
                placeholder="أدخل المفتاح السري من ملف .env"
                value={formData.adminKey} 
                onChange={handleChange} 
                required 
                style={{ border: '1px solid #e50914' }}
              />
            </div>

            <div className="form-group">
              <label>اسم المدير</label>
              <input name="username" type="text" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input name="email" type="email" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>رقم الهاتف</label>
              <input name="phone" type="tel" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>كلمة المرور</label>
              <input name="password" type="password" onChange={handleChange} required />
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "جاري الإنشاء..." : "إنشاء حساب المدير"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRootAdmin;