import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register/Register';
import VerifyOtp from './pages/Register/VerifyOtp';
import Profile from './pages/Profile/Profile';
import AdminSetup from './pages/adminBage/adminlogec';

function App() {
  return (
    <Routes>
      {/* 1. التوجيه التلقائي: أول ما الموقع يفتح يروح للتسجيل */}
      <Route path="/" element={<Navigate to="/register" />} />
      
      {/* 2. مسارات التسجيل والتحقق */}
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      
      {/* 3. مسار الملف الشخصي (بعد التفعيل) */}
      <Route path="/profile" element={<Profile />} />

      {/* 4. مسار إنشاء الأدمن (المسار السري) */}
      <Route path="/admin-init-secret" element={<AdminSetup />} />

      {/* 5. اختيار اختياري: توجيه أي رابط خطأ لصفحة التسجيل */}
      <Route path="*" element={<Navigate to="/register" />} />
    </Routes>
  );
}

export default App;