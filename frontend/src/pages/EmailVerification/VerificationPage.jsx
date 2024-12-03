//src/pages/EmailVerification/VerificationPage.jsx

import React, { useState, useEffect } from "react";
import styles from "./VerificationPage.module.css";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../../store/AuthStore";

const VerificationPage = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verifyEmail = useAuthStore((state) => state.verifyEmail);

  const notifySuccess = () => toast.success("Verified successfully!");
  const notifyEmailCheck = () => toast.info("Check your email for the verification code");

  useEffect(() => {
    notifyEmailCheck();
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const updatedDigits = [...digits];
    updatedDigits[index] = value;
    setDigits(updatedDigits);

    if (value && index < 5) {
      document.getElementById(`digit${index + 2}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = digits.join("");

    if (verificationCode.length !== 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Verifying email with code:", verificationCode); // Add debugging log

      await verifyEmail(verificationCode);

      console.log("Verification successful, showing success toast."); // Log after successful verification
      notifySuccess(); // Trigger success toast
    } catch (error) {
      console.error("Error verifying code:", error); // Log the error
      toast.error("Error verifying code."); // Show error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Enter Verification Code</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          {digits.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              id={`digit${index + 1}`}
              onChange={(e) => handleInputChange(e, index)}
              required
              className={styles.inputField}
              autoComplete="off"
            />
          ))}
        </div>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </button>
        {isSubmitting && <div className={styles.loader}></div>}
      </form>
      
      {/* Add ToastContainer here */}
      <ToastContainer 
        position="top-center" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default VerificationPage;
