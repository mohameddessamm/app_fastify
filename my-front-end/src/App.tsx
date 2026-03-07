import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/user/userTsx/Register';
import VerifyOtp from './pages/user/userTsx/VerifyOtp';
import Profile from './pages/Profile/Profile';
import Login from './pages/user/userTsx/login';
import CreateRootAdmin from './pages/adminBage/admintsx/adminlogec';
import LoginAdmin from './pages/adminBage/admintsx/adminlogin';
import MovieList from "./pages/movies/MovieList.tsx"
function App() {
  return (
    <Routes>
      {/* 1. التوجيه التلقائي: أول ما الموقع يفتح يروح للتسجيل */}
      <Route path="/" element={<Navigate to="/register" />} />
    <Route path="/movies" element={< MovieList/>} />
      {/* 2. مسارات التسجيل والتحقق */}
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      
      {/* 3. مسار الملف الشخصي (بعد التفعيل) */}
      <Route path="/profile" element={<Profile />} />

      {/* 4. مسار إنشاء الأدمن (المسار السري) */}
     <Route path="/create-admin" element={<CreateRootAdmin />} />
      <Route path="/admin-login" element={<LoginAdmin />} />

      {/* 5. اختيار اختياري: توجيه أي رابط خطأ لصفحة التسجيل */}
      <Route path="*" element={<Navigate to="/register" />} />
    </Routes>
  );
}

export default App;