
import { useState } from "react";

export default function ReceiveMail() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Đang lấy email...");
    setLoading(true);
    setEmails([]);

    try {
      const res = await fetch("/api/receiveMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setEmails(data.emails);
        setStatus(`✅ Đã tải ${data.emails.length} email`);
      } else {
        setStatus(`❌ Lỗi: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Không thể kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Nhận Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email của bạn"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu ứng dụng"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang tải..." : "Lấy Email"}
        </button>
      </form>
      <p>{status}</p>

      {emails.length > 0 && (
        <div className="email-list">
          <h3>Danh sách Email ({emails.length})</h3>
          {emails.map((email, index) => (
            <div key={index} className="email-item">
              <div className="email-header">
                <strong>Từ:</strong> {email.from}
              </div>
              <div className="email-header">
                <strong>Tiêu đề:</strong> {email.subject}
              </div>
              <div className="email-header">
                <strong>Ngày:</strong> {new Date(email.date).toLocaleString('vi-VN')}
              </div>
              <div className="email-body">
                {email.html ? (
                  <div dangerouslySetInnerHTML={{ __html: email.text?.substring(0, 500) || email.html?.substring(0, 500) }} />
                ) : (
                  <>
                    {email.text?.substring(0, 500)}
                    {email.text?.length > 500 && '...'}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        input {
          width: 100%;
          margin: 8px 0;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        button {
          width: 100%;
          background: #0070f3;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover:not(:disabled) {
          background: #0059c9;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .email-list {
          margin-top: 30px;
        }
        .email-item {
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin: 10px 0;
        }
        .email-header {
          margin: 5px 0;
        }
        .email-body {
          margin-top: 10px;
          padding: 10px;
          background: white;
          border-radius: 4px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
