const sendEmail =  require("../service/mailService.js");
const { generateResetPasswordToken } =  require("../utils/generateToken.js");

const registationEmailTemplate = (user) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
    <h2>Welcome to EventEase, ${user.name}!</h2>
    <p>Thanks for registering. Your account is now active.</p>
    <p><strong>Registered Email:</strong> ${user.email}</p>
    <p>You can now log in and start managing your events.</p>
    <a href="#" style="background-color:#4CAF50; color:white; padding:10px 20px; text-decoration:none; border-radius:4px;">
      Log In Now
    </a>
    <br><br>
    <p>– The EventEase Team</p>
  </body>
</html>`;

const resetPasswordEmailTemplate = (user) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Reset Your Password</h2>

    <p style="text-align: center; max-width: 400px;">
      Hi ${user.name},<br><br>
      We received a request to reset the password for your account registered with <strong>${user.email}</strong>.
    </p>

    <p style="text-align: center; max-width: 400px;">
      Click the button below to reset your password. This link will expire in 1 hour for your security.
    </p>

    <a href="${user.resetLink}" style="background-color: #FF6B6B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
      Reset Password
    </a>

    <p style="font-size: 14px; color: #777; text-align: center; max-width: 400px; margin-top: 20px;">
      If you didn't request a password reset, please ignore this email. Your account is safe.
    </p>

    <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
      – The EventEase Team
    </p>
  </body>
</html>
`;

const registationEmailNotification =  async (receiverEmail, receiverName) => {
    const user = {
        name: receiverName,
        email: receiverEmail
    }
    const  emailSubject = "Thank you for registering to EventEase";
    return await sendEmail({to: receiverEmail, subject: emailSubject, html:registationEmailTemplate(user)});
}


const resetPasswordEmailNotification = async(receiverEmail, receiverName) => {
  const user = {
        name: receiverName,
        email: receiverEmail,
        resetLink: resetUrl
    };
  const emailSubject = "Reset password";
  const resetUrl = generateResetPasswordToken(receiverEmail);
  return await sendEmail({to: receiverEmail, subject: emailSubject, html:resetPasswordEmailTemplate(user)});

}

module.exports = { 
  registationEmailNotification,
  resetPasswordEmailNotification,
}