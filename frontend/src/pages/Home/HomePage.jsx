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
    script.onload = () => {
      new window.Landbot.Fullpage({
        configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2711907-XMHUM9B2YY34U5CJ/index.json',
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
      <div id="landbot" className={styles.landbot} />
      <ToastContainer />
    </div>
  );
};

export default HomePage;

// const HomePage = () => {
//   const logout = useAuthStore((state) => state.logout); // Access logout function from AuthStore
//   const navigate = useNavigate(); // For navigation

//   const handleLogout = async () => {
//     try {
//       await logout(); // Perform logout
//       navigate('/'); // Redirect to /
//     } catch (error) {
//       console.error('Error during logout:', error);
//       toast.error(error.message || 'Error logging out. Please try again.'); // Show error toast
//     }
//   };

//   return (
//     <div>
//       <i
//         className={`fa fa-sign-out ${styles['logout-icon']}`}
//         onClick={handleLogout} // Handle logout on click
//       />
//       <div className={styles.container}>
//         <h1>Home Page</h1>
//         <p>Welcome to your homepage!</p>
//       </div>

//       {/* Toast Container to show notifications */}
//       <ToastContainer />
//     </div>
//   );
// };

// export default HomePage;
