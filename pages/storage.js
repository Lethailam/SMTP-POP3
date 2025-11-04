
import { useState, useEffect } from "react";

export default function Storage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoredEmails();
  }, []);

  const fetchStoredEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/getStoredEmails");
      const data = await res.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error("Error fetching stored emails:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>📦 Kho Lưu Trữ Email (7 ngày gần nhất)</h2>
      
      <button 
        onClick={fetchStoredEmails}
        style={{
          padding: '10px 20px',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🔄 Làm mới
      </button>

      {loading ? (
        <p>Đang tải...</p>
      ) : emails.length === 0 ? (
        <p>Chưa có email nào được lưu</p>
      ) : (
        <div className="email-list">
          <h3>Tổng số: {emails.length} email</h3>
          {emails.map((email) => (
            <div key={email.id} className="email-item">
              <div className="email-header">
                <strong>Từ:</strong> {email.from}
              </div>
              <div className="email-header">
                <strong>Đến:</strong> {email.to}
              </div>
              <div className="email-header">
                <strong>Tiêu đề:</strong> {email.subject}
              </div>
              <div className="email-header">
                <strong>Ngày:</strong> {new Date(email.date).toLocaleString('vi-VN')}
              </div>
              <div className="email-body">
                {email.text}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .email-list {
          margin-top: 20px;
        }
        .email-item {
          background: #0d0d0dff;
          border: 1px solid #3a3737ff;
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
          background: black;
          border-radius: 4px;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
}
