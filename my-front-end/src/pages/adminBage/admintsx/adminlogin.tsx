import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios'; 
import '../admincss/logincss.css'; // نستخدم نفس التنسيق الجمالي للأدمن
import { AxiosError } from 'axios';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', adminKey: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/admin/login-admin', 
        { email: formData.email, password: formData.password }, 
        { headers: { 'x-admin-key': formData.adminKey } } // إرسال المفتاح في الهيدر
      );

      alert(response.data.message);
      navigate('/admin/dashboard'); // التوجه للوحة التحكم

    } catch (error: unknown) {
      const err = error as AxiosError<any>;
      alert(err.response?.data?.message || 'فشل تسجيل دخول المدير');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-card">
        <h2>ADMIN LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>ADMIN SECRET KEY</label>
            <input 
              type="password" 
              name="adminKey" 
              onChange={(e) => setFormData({...formData, adminKey: e.target.value})} 
              required 
            />
          </div>
          <div className="admin-form-group">
            <label>EMAIL</label>
            <input 
              type="email" 
              name="email" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <div className="admin-form-group">
            <label>PASSWORD</label>
            <input 
              type="password" 
              name="password" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <button className="admin-setup-btn" disabled={loading}>
            {loading ? "Checking..." : "LOGIN TO DASHBOARD"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;