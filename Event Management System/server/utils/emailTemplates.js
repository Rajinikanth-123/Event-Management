const buildRegistrationEmail = ({ appName, event, ticketNumber, qrCode, attendeeName }) => `
  <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:24px; color:#0f172a;">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; padding:32px; box-shadow:0 20px 50px rgba(15,23,42,0.08);">
      <h1 style="margin:0 0 12px; font-size:28px;">${appName}</h1>
      <p style="font-size:16px; line-height:1.6;">Hello ${attendeeName}, your registration is confirmed.</p>
      <div style="background:#f1f5f9; border-radius:16px; padding:20px; margin:24px 0;">
        <p><strong>Event:</strong> ${event.title}</p>
        <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Venue:</strong> ${event.venue}, ${event.city}</p>
        <p><strong>Organizer:</strong> ${event.organizer?.name || 'Event Team'}</p>
      </div>
      <div style="text-align:center; margin:24px 0;">
        <img src="${qrCode}" alt="QR Code" style="width:220px; height:220px; border-radius:16px; border:1px solid #e2e8f0;" />
      </div>
      <p style="font-size:14px; color:#475569;">Thank you for registering. Keep this email for check-in and ticket verification.</p>
    </div>
  </div>
`;

const buildPasswordResetEmail = ({ appName, resetUrl, userName }) => `
  <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:24px; color:#0f172a;">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; padding:32px; box-shadow:0 20px 50px rgba(15,23,42,0.08);">
      <h1 style="margin:0 0 12px; font-size:28px;">${appName}</h1>
      <p style="font-size:16px; line-height:1.6;">Hi ${userName}, we received a request to reset your password.</p>
      <p style="font-size:16px; line-height:1.6;">Click the button below to continue.</p>
      <p style="margin:28px 0;"><a href="${resetUrl}" style="display:inline-block; background:#0f172a; color:#fff; text-decoration:none; padding:14px 20px; border-radius:999px; font-weight:700;">Reset Password</a></p>
      <p style="font-size:14px; color:#475569;">If you did not request this email, you can safely ignore it.</p>
    </div>
  </div>
`;

module.exports = { buildRegistrationEmail, buildPasswordResetEmail };