import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register/Register';
import VerifyOtp from './pages/Register/VerifyOtp';

function App() {
  return (
    <Routes>
      {/* توجيه المستخدم لصفحة التسجيل عند فتح الموقع */}
      <Route path="/" element={<Navigate to="/register" />} />
      
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
    </Routes>
  );
}

export default App;