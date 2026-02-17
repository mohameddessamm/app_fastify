import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminDashboard.css';

interface Movie {
  id: number;
  title: string;
  genre: string[];
  rating: number;
}

const AdminDashboard: React.FC = () => {
  const [adminName, setAdminName] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]); // لتخزين قائمة الأفلام
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    videoUrl: '',
    genre: '', // سنقوم بتحويله لمصفوفة عند الإرسال
    rating: '0'
  });

  // 1. جلب البيانات عند فتح الصفحة
  useEffect(() => {
    fetchAdminData();
    fetchMovies();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/auth/profile');
      setAdminName(res.data.user.username);
    } catch (err) { setAdminName("المدير"); }
  };

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies'); // افترضنا وجود مسار لجلب الكل
      setMovies(res.data);
    } catch (err) { console.error("خطأ في جلب الأفلام"); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. منطق إضافة الفيلم (تعديل الـ genre والـ rating)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        genre: [formData.genre], // تحويل النص لمصفوفة كما تتوقع الـ Schema
        rating: parseFloat(formData.rating)
      };

      await api.post('/admin/movies', dataToSend);
      alert("✅ تم إضافة الفيلم!");
      fetchMovies(); // تحديث القائمة
      setFormData({ title: '', description: '', posterUrl: '', videoUrl: '', genre: '', rating: '0' });
    } catch (error: any) {
      alert(error.response?.data?.message || "فشل الإضافة");
    }
  };

  // 3. منطق حذف الفيلم
  const handleDelete = async (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الفيلم؟")) {
      try {
        await api.delete(`/admin/movies/${id}`);
        setMovies(movies.filter(m => m.id !== id)); // إزالة من الواجهة فوراً
        alert("🗑️ تم الحذف بنجاح");
      } catch (err) { alert("فشل الحذف"); }
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>لوحة التحكم | مرحباً <span className="admin-name">{adminName}</span></h1>
      </header>

      <div className="dashboard-grid">
        {/* فورم الإضافة */}
        <section className="add-movie-section">
          <h2>🎬 إضافة فيلم جديد</h2>
          <form onSubmit={handleSubmit} className="movie-form">
            <input type="text" name="title" placeholder="عنوان الفيلم" value={formData.title} onChange={handleChange} required />
            <textarea name="description" placeholder="وصف الفيلم" value={formData.description} onChange={handleChange} />
            <input type="text" name="posterUrl" placeholder="رابط البوستر" value={formData.posterUrl} onChange={handleChange} />
            <input type="text" name="genre" placeholder="التصنيف (مثلاً: Horror)" value={formData.genre} onChange={handleChange} />
            <input type="number" name="rating" step="0.1" placeholder="التقييم" value={formData.rating} onChange={handleChange} />
            <button type="submit" className="submit-btn">إضافة الفيلم</button>
          </form>
        </section>

        {/* جدول الأفلام المضافة */}
        <section className="movies-list-section">
          <h2>📦 الأفلام الحالية</h2>
          <table className="movies-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>العنوان</th>
                <th>التصنيف</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>{movie.title}</td>
                  <td>{movie.genre.join(', ')}</td>
                  <td>
                    <button onClick={() => handleDelete(movie.id)} className="delete-btn">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;