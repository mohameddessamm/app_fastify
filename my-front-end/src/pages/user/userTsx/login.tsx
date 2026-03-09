import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import styles from '../userCss/login.module.css';
import { AxiosError } from 'axios';

const Login: React.FC = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);

    try {

      const response = await api.post('/auth/login', formData);

      if (response.status === 200) {

        const user = response.data.user;
        const role = user?.role;

        console.log("Login Successful, User Role:", role);

        if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }

      }

    } catch (error: unknown) {

      const err = error as AxiosError<any>;

      const errorMessage =
        err.response?.data?.message ||
        "البريد الإلكتروني أو كلمة المرور غير صحيحة";

      alert(errorMessage);

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className={styles.loginContainer}>

      <div className={styles.loginMain}>

        <div className={styles.loginCard}>

          <h2>تسجيل الدخول</h2>

          <form onSubmit={handleSubmit}>

            <div className={styles.loginFormGroup}>

              <label>البريد الإلكتروني</label>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />

            </div>

            <div className={styles.loginFormGroup}>

              <label>كلمة المرور</label>

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />

            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </button>

          </form>

        </div>

      </div>

    </div>

  );

};

export default Login;