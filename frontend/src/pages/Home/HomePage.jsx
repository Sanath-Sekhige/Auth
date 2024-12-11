// src/pages/Home/HomePage.jsx

import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './HomePage.module.css';

const HomePage = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(error.message || 'Error logging out. Please try again.');
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.js';
    script.async = true;
    script.setAttribute('SameSite', 'None');
    script.setAttribute('Secure', 'true');

    script.onload = () => {
      new window.Landbot.Container({
        container: '#myLandbot',
        configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2715655-XHEJJ82H6AMIZKUS/index.json',
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      <i
        className={`fa fa-sign-out ${styles.logoutIcon}`}
        onClick={handleLogout}
      />
      <div id="myLandbot" className={styles.landbot}></div>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
