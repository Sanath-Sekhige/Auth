//src/pages/Auth/AuthPage.jsx

import React, { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore'; // Adjust the path as necessary
import styles from './AuthPage.module.css'; // Import CSS module
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles for the toast
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signup, login, isLoading, error } = useAuthStore();
  const navigate = useNavigate(); // Hook to navigate to different pages

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleRegisterClick = () => {
    setIsSignUp(true);
    resetFields(); // Reset fields when switching to Sign Up
  };

  const handleLoginClick = () => {
    setIsSignUp(false);
    resetFields(); // Reset fields when switching to Sign In
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Handle sign up
      try {
        await signup(email, password, name);
        toast.success('Successfully signed up!');
        // Open the verify-email page in a new tab
        window.open('/verify-email', '_blank'); // This opens the page in a new tab
      } catch (err) {
        toast.error(error || 'Error during sign up');
      }
    } else {
      // Handle login
      try {
        await login(email, password);
        toast.success('Successfully logged in!');
        // Navigate to home page
        navigate('/home');
      } catch (err) {
        toast.error(error || 'Error during login');
      }
    }
  };

  // Password reset function
  const handlePasswordReset = () => {
    // Open the forgot password page in a new tab
    window.open('/forgot-password', '_blank');
  };  

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

      <div className={`${styles.container} ${isSignUp ? styles.active : ''}`}>
        {/* Sign Up Form */}
        <div className={`${styles['form-container']} ${styles['sign-up']}`}>
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <span>use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`${styles['form-container']} ${styles['sign-in']}`}>
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <span>use your email password</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className={styles.forgotPassword} onClick={handlePasswordReset}>
              Forgot Your Password?
            </span>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Toggle Panel */}
        <div className={styles['toggle-container']}>
          <div className={styles.toggle}>
            <div className={`${styles['toggle-panel']} ${styles['toggle-left']}`}>
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of the site's features</p>
              <button className={styles.hidden} onClick={handleLoginClick}>
                Sign In
              </button>
            </div>
            <div className={`${styles['toggle-panel']} ${styles['toggle-right']}`}>
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of the site's features</p>
              <button className={styles.hidden} onClick={handleRegisterClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthPage;
