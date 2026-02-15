import React, { useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // مهم لجلب التليفون
import api from '../../api/axios'; // تأكد من مسار axios
import './VerifyOtp.css';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const location = useLocation();
  const navigate = useNavigate();
  
  // جلب رقم الهاتف اللي بعتناه من صفحة التسجيل
  const phone = location.state?.phone;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // تحريك التركيز للمربع التالي
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join(''); // تجميع الـ 6 أرقام

    if (otpCode.length < 6) {
      alert("من فضلك أدخل الكود كاملاً");
      return;
    }

    if (!phone) {
      alert("حدث خطأ: رقم الهاتف مفقود، يرجى إعادة التسجيل");
      return;
    }

    try {
      // 🚀 إرسال الطلب للباك-إيند (المسار بتاعك)
      const response = await api.post('/verify-otp', { 
        phone: phone, 
        otp: otpCode 
      });

      if (response.status === 200) {
        alert("تم تفعيل الحساب بنجاح! جاري توجيهك...");
        // توجيه المستخدم للصفحة الرئيسية أو لوحة التحكم
        navigate('/home'); 
      }
    } catch (error: any) {
      // معالجة الأخطاء بناءً على الرسايل اللي إنت كاتبها في الباك-إيند
      const message = error.response?.data?.message || "كود غير صحيح أو منتهي الصلاحية";
      alert(message);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="lock-icon">🔒</div>
        <h2>تأكيد الهوية</h2>
        <p>أدخل الكود المرسل إلى الرقم: <strong>{phone}</strong></p>
        
        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
              />
            ))}
          </div>
          <button type="submit" className="verify-button">تأكيد الرمز</button>
        </form>
        
        <div className="resend-text">
          لم يصلك الكود؟ <span>إرسال مرة أخرى</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;