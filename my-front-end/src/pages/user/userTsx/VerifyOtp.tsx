import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../api/axios'; 
import '../userCss/VerifyOtp.css';

const VerifyOtp: React.FC = () => {
  // 1. التعريفات داخل الـ Component
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false); // مكانها الصحيح هنا
  const location = useLocation();
  const navigate = useNavigate();
  
  const phone = location.state?.phone;

  // 2. منطق إدخال الأرقام
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value !== '' && e.target.nextElementSibling) {
      (e.target.nextElementSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevSibling = (e.currentTarget.previousElementSibling as HTMLInputElement);
      if (prevSibling) prevSibling.focus();
    }
  };

  // 3. إرسال الكود
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      alert("من فضلك أدخل الكود كاملاً");
      return;
    }

    if (!phone) {
      alert("رقم الهاتف مفقود، يرجى العودة لصفحة التسجيل");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', { 
        phone: phone, 
        otp: otpCode 
      });

      if (response.status === 200) {
        alert("تم تفعيل الحساب بنجاح!");
        navigate('/profile'); 
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "الكود غير صحيح";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="lock-icon">🔒</div>
        <h2>تأكيد الهوية</h2>
        <p>أدخل الكود المرسل إلى الرقم: <strong>{phone || "غير معروف"}</strong></p>
        
        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                disabled={loading} // تعطيل الإدخال أثناء التحميل
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
              />
            ))}
          </div>
          <button type="submit" className="verify-button" disabled={loading}>
            {loading ? "جاري التحقق..." : "تأكيد الرمز"}
          </button>
        </form>
        
        <div className="resend-text">
          لم يصلك الكود؟ <span>إرسال مرة أخرى</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;