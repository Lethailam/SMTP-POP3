import { useState } from "react";

export default function SendMail() {
  const [form, setForm] = useState({
    sender_email: "",
    sender_password: "",
    receiver_email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Đang gửi...");

    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Gửi thành công!");
      } else {
        setStatus(`❌ Lỗi: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Không thể kết nối đến server.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Gửi Email</h2>
      <form onSubmit={handleSubmit}>
        <input name="sender_email" placeholder="Email người gửi" onChange={handleChange} required />
        <input name="sender_password" type="password" placeholder="Mật khẩu ứng dụng" onChange={handleChange} required />
        <input name="receiver_email" placeholder="Email người nhận" onChange={handleChange} required />
        <input name="subject" placeholder="Tiêu đề" onChange={handleChange} required />
        <textarea name="message" placeholder="Nội dung" onChange={handleChange} required />
        <button type="submit">Gửi</button>
      </form>
      <p>{status}</p>

      <style jsx>{`
        input, textarea {
          width: 100%;
          margin: 8px 0;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        button {
          width: 100%;
          background: #0070f3;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        button:hover {
          background: #0059c9;
        }
      `}</style>
    </div>
  );
}