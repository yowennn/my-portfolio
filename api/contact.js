import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, message, website } = req.body;

  // Honeypot spam protection
  if (website) {
    return res.status(400).json({ message: "Spam detected" });
  }

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL,
      subject: `New message from ${name}`,
      text: message,
    });

    return res.status(200).json({
      message: "Message sent successfully!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error. Email not sent."
    });
  }
}
