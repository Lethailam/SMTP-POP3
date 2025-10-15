// pages/api/sendMail.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { sender_email, sender_password, receiver_email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    await transporter.sendMail({
      from: sender_email,
      to: receiver_email,
      subject,
      text: message,
    });

    return res.status(200).json({ message: "Email đã được gửi thành công!" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: "Gửi email thất bại" });
  }
}