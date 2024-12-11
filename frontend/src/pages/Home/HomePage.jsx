//src/pages/Home/HomePage.jsx

import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore'; // Correct
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

  useEffect(() => {
    // Dynamically load the Landbot script
    const script = document.createElement('script');
    script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.js';
    script.async = true;
    script.onload = () => {
      // Initialize the Landbot chatbot
      new window.Landbot.Fullpage({
        configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2711907-XMHUM9B2YY34U5CJ/index.json',
      });
    };
    document.body.appendChild(script);

    // Cleanup function to remove the script if the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

      {/* This div is where the Landbot will render the chatbot */}
      <div id="landbot" style={{ width: '100%', height: '100vh' }} />

      {/* Toast Container to show notifications */}
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
