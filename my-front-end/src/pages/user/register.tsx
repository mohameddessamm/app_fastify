import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // تأكد من المسار الصحيح لملفك
import { Skull, Mail, Lock, Phone, User, Ghost, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('auth/register', formData);
      
      if (response.status === 201) {
        // ننتقل لصفحة التحقق ونمرر الإيميل في الـ state
        navigate('/verify-otp', { state: { email: formData.email } });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative font-sans overflow-hidden">
      {/* خلفية مرعبة خفيفة */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-50"></div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <Skull className="text-red-600 w-12 h-12 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-black text-white uppercase italic">إنشاء حساب جديد</h2>
          <p className="text-gray-400 text-sm mt-2 font-light">استعد لدخول عالم الرعب</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input name="username" type="text" placeholder="اسم المستخدم" required onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-11 pr-4 text-white focus:border-red-600 outline-none transition-all" />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input name="email" type="email" placeholder="البريد الإلكتروني" required onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-11 pr-4 text-white focus:border-red-600 outline-none transition-all" />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input name="phone" type="text" placeholder="رقم الهاتف" required onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-11 pr-4 text-white focus:border-red-600 outline-none transition-all" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input name="password" type="password" placeholder="كلمة المرور" required onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-11 pr-4 text-white focus:border-red-600 outline-none transition-all" />
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-600/50 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"} <Ghost size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;