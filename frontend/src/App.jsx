//src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom"; // Added useNavigate

import HomePage from './pages/Home/HomePage';
import AuthPage from './pages/Auth/AuthPage';
import VerificationPage from './pages/EmailVerification/VerificationPage';
import ForgotPassword from './pages/ForgotPassword/ForgotPasswordPage';
import ResetPassword from './pages/ResetPassword/ResetPasswordPage';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/verify-email" element={<VerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<HomePage />} /> 
      </Routes>
    </div>
  );
};

export default App;
