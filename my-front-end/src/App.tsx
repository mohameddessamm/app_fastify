import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/user/Register";
import VerifyOtp from "./pages/user/VerifyOtp";
import Profile from "./pages/Profile/Profile";
import AdminSetup from "./pages/adminBage/adminlogec";
import Login from "./pages/adminBage/LoginAdmin";
import AdminDashboard from "./pages/adminBage/AdminDashboard";
// استيراد الصفحات الجديدة (تأكد من إنشاء هذه الملفات)
// import AdminDashboard from './pages/adminBage/AdminDashboard';
// import AddMovie from './pages/adminBage/AddMovie';

function App() {
  return (
    <Routes>
      {/* 1. المسار الرئيسي: التوجيه للتسجيل */}
      <Route path="/" element={<Navigate to="/register" />} />

      {/* 2. مسارات المستخدم (User Routes) */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/profile" element={<Profile />} />

      {/* 3. مسارات الأدمن (Admin Routes) */}

      {/* إنشاء حساب الأدمن لأول مرة (المسار السري) */}
      <Route path="/admin-init-secret" element={<AdminSetup />} />

      {/* لوحة تحكم الأدمن - تعرض قائمة الأفلام مع خيار الحذف */}
 <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* صفحة إضافة فيلم جديد */}
      {/* <Route path="/admin/add-movie" element={<AddMovie />} /> */}

      {/* 4. معالجة الروابط غير الموجودة */}
      <Route path="*" element={<Navigate to="/register" />} />
    </Routes>
  );
}

export default App;
