
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const emailsFilePath = path.join(process.cwd(), 'emails.json');
    
    if (!fs.existsSync(emailsFilePath)) {
      return res.status(200).json({ emails: [] });
    }

    const fileContent = fs.readFileSync(emailsFilePath, 'utf8');
    const emails = JSON.parse(fileContent);

    // Lấy email trong 7 ngày gần nhất
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEmails = emails.filter(email => {
      const emailDate = new Date(email.date);
      return emailDate >= sevenDaysAgo;
    });

    return res.status(200).json({ emails: recentEmails.reverse() });
  } catch (error) {
    console.error('Error reading emails:', error);
    return res.status(500).json({ error: 'Không thể đọc email', emails: [] });
  }
}
