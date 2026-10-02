import nodemailer from "nodemailer";

export const sendRegistrationCode = async (email, firstName, code) => {
  const { SMTP_HOST, SMTP_FROM } = process.env;
  const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
  const configuredMinutes = Number(process.env.OTP_TTL_MINUTES);
  const lifetimeMinutes =
    Number.isInteger(configuredMinutes) && configuredMinutes > 0
      ? configuredMinutes
      : 10;

  if (!SMTP_HOST || !SMTP_FROM || !Number.isInteger(SMTP_PORT)) {
    const error = new Error("Email delivery is not configured");
    error.statusCode = 503;
    throw error;
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true" || SMTP_PORT === 465,
    ...(SMTP_USER && SMTP_PASSWORD
      ? { auth: { user: SMTP_USER, pass: SMTP_PASSWORD } }
      : {}),
  });

  await transport.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: "Your Fhast Pay verification code",
    text: `Hello ${firstName},\n\nYour verification code is ${code}. It expires in ${lifetimeMinutes} minutes.\n\nIf you did not create a Fhast Pay account, you can ignore this email.`,
  });
};