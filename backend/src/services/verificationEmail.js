import nodemailer from "nodemailer";

export class VerificationEmailError extends Error {}

export async function sendVerificationCode(email, code) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new VerificationEmailError(
      "Email verification is not configured on the server.",
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `Sky Mart <${user}>`,
      to: email,
      subject: "Your Sky Mart verification code",
      text: `Your Sky Mart verification code is ${code}. It expires in 15 minutes.`,
      html: `<h1>Verify your email</h1><p>Your Sky Mart verification code is:</p><p style="font-size: 28px; font-weight: bold; letter-spacing: 5px;">${code}</p><p>This code expires in 15 minutes.</p>`,
    });
  } catch {
    throw new VerificationEmailError(
      "We could not send the verification code. Please try again shortly.",
    );
  }
}
