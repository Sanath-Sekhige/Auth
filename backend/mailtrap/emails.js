//backend/mailtrap/emails.js

import { mailtrapClient, sender } from "./mailtrap.config.js"; // Assuming you have this configured
import {
	VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    RESET_PASSWORD_EMAIL_TEMPLATE,
    RESET_SUCCESS_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

// Send Verification Email function
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      text: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification",
    });

    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];
  
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Welcome to Our App!",
        text: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
        category: "Welcome Email",
      });
  
      console.log("Welcome email sent successfully", response);
    } catch (error) {
      console.error("Error sending welcome email", error);
      throw new Error(`Error sending welcome email: ${error}`);
    }
  };

  export const sendPasswordResetEmail = async (email, resetUrl) => {
    const recipient = [{ email }];
  
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Password Reset Request",
        text: RESET_PASSWORD_EMAIL_TEMPLATE.replace("{resetUrl}", resetUrl),
        category: "Password Reset",
      });
  
      console.log("Password reset email sent successfully", response);
    } catch (error) {
      console.error("Error sending password reset email", error);
      throw new Error(`Error sending password reset email: ${error}`);
    }
  };
  
  // Send Password Reset Success Email function
  export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];
  
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Password Reset Successful",
        text: RESET_SUCCESS_EMAIL_TEMPLATE,
        category: "Password Reset Success",
      });
  
      console.log("Password reset success email sent successfully", response);
    } catch (error) {
      console.error("Error sending password reset success email", error);
      throw new Error(`Error sending password reset success email: ${error}`);
    }
  };