export function verificationEmailTemplate(url: string) {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 6px;">

      <h2 style="color: #333333; margin-top: 0;">
        Verify Your Email Address
      </h2>

      <p style="color: #555555;">
        Thank you for signing up! Please click the button below to verify your email address:
      </p>

      <div style="margin: 24px 0;">
        <a
          href="${url}"
          style="display: inline-block; padding: 12px 24px; color: #ffffff; background-color: #2563eb; text-decoration: none; border-radius: 5px; font-weight: bold;"
        >
          Verify Email
        </a>
      </div>

      <p style="font-size: 12px; color: #888888;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>

      <p style="word-break: break-all; font-size: 12px; color: #555;">
        ${url}
      </p>

      <p style="font-size: 12px; color: #888888; margin-top: 16px;">
        This link will expire in 24 hours.
      </p>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 24px 0;" />

      <p style="color: #555555; font-size: 14px;">
        If you did not create an account, no further action is required.
      </p>

      <p style="color: #555555; font-size: 14px;">
        Best regards,<br/>
        MultiCommerce Team
      </p>

    </div>
  </div>
  `;
}

export function resetPasswordTemplate(url: string) {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 6px;">

      <h2 style="color: #333333; margin-top: 0;">
        Reset Your Password
      </h2>

      <p style="color: #555555;">
        You requested to reset your password. Please click the button below to proceed:
      </p>

      <div style="margin: 24px 0;">
        <a
          href="${url}"
          style="display: inline-block; padding: 12px 24px; color: #ffffff; background-color: #2563eb; text-decoration: none; border-radius: 5px; font-weight: bold;"
        >
          Reset Password
        </a>
      </div>

      <p style="font-size: 12px; color: #888888;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>

      <p style="word-break: break-all; font-size: 12px; color: #555;">
        ${url}
      </p>

      <p style="font-size: 12px; color: #888888; margin-top: 16px;">
        This link will expire in 24 hours.
      </p>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 24px 0;" />

      <p style="color: #555555; font-size: 14px;">
        If you did not request a password reset, no further action is required.
      </p>

      <p style="color: #555555; font-size: 14px;">
        Best regards,<br/>
        MultiCommerce Team
      </p>

    </div>
  </div>
  `;
}
