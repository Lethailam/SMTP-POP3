import fs from 'fs';
import path from 'path';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { sender_email, receiver_email, subject, message, date } = req.body;
  try {
    const emailsFilePath = path.join(process.cwd(), 'emails.json');
    let emails = [];
    if (fs.existsSync(emailsFilePath)) {
      const fileContent = fs.readFileSync(emailsFilePath, 'utf8');
      emails = JSON.parse(fileContent);
    }
    const newEmail = {
      id: Date.now(),
      from: sender_email,
      to: receiver_email,
      subject: subject,
      text: message,
      date: date || new Date().toISOString(),
      read: false,
    };
    emails.push(newEmail);
    fs.writeFileSync(emailsFilePath, JSON.stringify(emails, null, 2));
    return res.status(200).json({ message: 'Email đã được lưu', email: newEmail });
  } catch (error) {
    console.error('Error saving email:', error);
    return res.status(500).json({ error: 'Không thể lưu email' });
  }
}