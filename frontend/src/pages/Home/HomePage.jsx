//src/pages/Home/HomePage.jsx

import React from 'react';
import { useAuthStore } from '../../store/AuthStore';  // Correct
import { useNavigate } from 'react-router-dom'; // For navigation
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify
import styles from './HomePage.module.css'; // Import CSS module

const HomePage = () => {
  const logout = useAuthStore((state) => state.logout); // Access logout function from AuthStore
  const navigate = useNavigate(); // For navigation

  const handleLogout = async () => {
    try {
      await logout(); // Perform logout
      navigate('/'); // Redirect to /
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(error.message || 'Error logging out. Please try again.'); // Show error toast
    }
  };

  return (
    <div>
      <i
        className={`fa fa-sign-out ${styles['logout-icon']}`}
        onClick={handleLogout} // Handle logout on click
      />
      <div className={styles.container}>
        <h1>Home Page</h1>
        <p>Welcome to your homepage!</p>
      </div>

      {/* Toast Container to show notifications */}
      <ToastContainer />
    </div>
  );
};

export default HomePage;
