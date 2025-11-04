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

    // Lưu email vào kho lưu trữ
    const saveResponse = await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/saveEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_email,
        receiver_email,
        subject,
        message,
        date: new Date().toISOString()
      })
    });

    return res.status(200).json({ message: "Email đã được gửi và lưu thành công!" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: "Gửi email thất bại" });
  }
}