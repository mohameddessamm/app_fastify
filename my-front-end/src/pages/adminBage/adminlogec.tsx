import React, { useState } from 'react';
import api from '../../api/axios';
import './AdminSetup.css';

const AdminSetup: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        adminKey: '' // المفتاح السري المطلوب في الهيدر
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/create-root-admin', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            }, {
                // إرسال المفتاح السري في الهيدر كما يتوقع الباك-إيند
                headers: { 'x-admin-key': formData.adminKey }
            });

            alert(response.data.message);
        } catch (error: any) {
            alert(error.response?.data?.message || "حدث خطأ أثناء إنشاء الأدمن");
        }
    };

    return (
        <div className="admin-setup-container">
            <div className="admin-setup-card">
                <div className="shield-icon">🛡️</div>
                <h2>إنشاء المدير الرئيسي</h2>
                <p>إعداد النظام للمرة الأولى</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>المفتاح السري للنظام (Admin Key)</label>
                        <input type="password" name="adminKey" onChange={handleChange} required placeholder="ادخل مفتاح الأمان..." />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>اسم المستخدم</label>
                            <input type="text" name="username" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>رقم الهاتف</label>
                            <input type="text" name="phone" onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>البريد الإلكتروني</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>كلمة المرور</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="setup-button">تفعيل صلاحيات الأدمن</button>
                </form>
            </div>
        </div>
    );
};

export default AdminSetup;