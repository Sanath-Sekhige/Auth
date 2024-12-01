//backend/mailtrap/emailTemplates.js

export const VERIFICATION_EMAIL_TEMPLATE = `
Hello,

Thank you for signing up! To verify your email, please use the following verification code:

{verificationCode}

This code will expire in 24 hours.

Best regards,
Your App Team
`;

export const WELCOME_EMAIL_TEMPLATE = `
Hello {name},

Welcome to our application! We're thrilled to have you on board. Your email has been successfully verified.

If you have any questions, feel free to contact our support team.

Best regards,
Your App Team
`;

export const RESET_PASSWORD_EMAIL_TEMPLATE = `
Hello,

You recently requested to reset your password. Click the link below to reset it:

{resetUrl}

If you did not request a password reset, you can safely ignore this email. The link will expire in 1 hour.

Best regards,
Your App Team
`;

export const RESET_SUCCESS_EMAIL_TEMPLATE = `
Hello,

Your password has been successfully reset. If you did not perform this action, please contact our support team immediately.

Best regards,
Your App Team
`;
