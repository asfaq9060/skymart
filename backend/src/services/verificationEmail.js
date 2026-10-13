import nodemailer from "nodemailer";

export class VerificationEmailError extends Error {
  constructor(message) {
    super(message);
    this.name = "VerificationEmailError";
  }
}

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

const transporter =
  user && pass
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
      })
    : null;

export async function sendVerificationCode(email, code) {
  if (!transporter) {
    console.error("[OTP] Gmail configuration is missing.");

    throw new VerificationEmailError(
      "Email verification is not configured on the server.",
    );
  }

  try {
    const info = await transporter.sendMail({
      from: {
        name: "Sky Mart",
        address: user,
      },
      to: email,
      subject: "Your Sky Mart verification code",
      text: `Your Sky Mart verification code is ${code}. It expires in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Verify your email</h2>
          <p>Your Sky Mart verification code is:</p>
          <p style="font-size:28px;font-weight:bold;letter-spacing:5px;">
            ${code}
          </p>
          <p>This code expires in 15 minutes.</p>
          <p>If you did not request this code, ignore this email.</p>
        </div>
      `,
    });

    console.info("[OTP] Verification email accepted by SMTP.", {
      messageId: info.messageId,
      accepted: info.accepted?.length ?? 0,
      rejected: info.rejected?.length ?? 0,
    });
  } catch (error) {
    // Keep detailed diagnostics in server logs only.
    console.error("[OTP] Email delivery failed.", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
    });

    throw new VerificationEmailError(
      "We could not send the verification code. Please try again shortly.",
    );
  }
}
