import React, { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore'; // Import the auth store
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom'; // Import useParams to access dynamic segments of the URL path
import styles from './ResetPasswordPage.module.css';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const { resetPassword, isLoading, error } = useAuthStore(); // Use resetPassword from AuthStore

  // Get the token from the URL using useParams hook
  const { token } = useParams(); // Extract token from dynamic URL path

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('Please enter a new password!');
      return;
    }

    if (!token) {
      toast.error('Reset token not found!');
      return;
    }

    try {
      // Sending password as 'password' key
      await resetPassword(token, newPassword); // Pass both token and newPassword to the resetPassword function
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(error || 'Error resetting password.');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      <div className={styles.container}>
        <h1>Enter Your New Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
