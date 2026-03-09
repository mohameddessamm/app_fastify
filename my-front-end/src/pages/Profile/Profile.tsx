import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. استيراد useNavigate
import api from '../../api/axios';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. تعريف التوجيه

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/profile');
        setUser(response.data.user);
      } catch (error) {
        console.error("فشل في جلب البيانات", error);
        // 3. التوجيه لصفحة تسجيل الدخول بدلاً من التسجيل
        navigate('/login'); 
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <div style={{color: 'white', textAlign: 'center'}}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', padding: '50px' }}>
      <h1>{user?.username} أهلاً بك</h1>
      <div style={{ background: '#141414', padding: '20px', borderRadius: '10px' }}>
        <p><strong>البريد الإلكتروني:</strong> {user?.email}</p>
        <p><strong>رقم الهاتف:</strong> {user?.phone}</p>
        <p><strong>حالة الحساب:</strong> ✅ موثق</p>
      </div>
    </div>
  );
};

export default Profile;