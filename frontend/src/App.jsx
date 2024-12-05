// src/App.jsx

import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import('./pages/Home/HomePage'));
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));
const VerificationPage = lazy(() => import('./pages/EmailVerification/VerificationPage'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPasswordPage'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPasswordPage'));

const App = () => {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
