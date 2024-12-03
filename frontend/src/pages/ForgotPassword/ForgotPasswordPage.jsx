import React, { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore'; // Import the auth store
import { toast, ToastContainer } from 'react-toastify';
import styles from './ForgotPasswordPage.module.css';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { forgotPassword, isLoading, error } = useAuthStore(); // Use forgotPassword from AuthStore

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email!');
      return;
    }
    try {
      await forgotPassword(email); // Call forgotPassword with the entered email
      toast.success('Password reset email sent successfully!');
    } catch (err) {
      toast.error(error || 'Error sending password reset email.');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      <div className={styles.container}>
        <h1>Enter Your Email</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;
