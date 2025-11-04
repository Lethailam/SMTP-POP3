import Imap from 'imap';
import { simpleParser } from 'mailparser';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { email, password } = req.body;
  try {
    const emails = await fetchEmails(email, password);
    return res.status(200).json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return res.status(500).json({ error: 'Không thể lấy email' });
  }
}
function fetchEmails(email, password) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: email,
      password: password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });
    const emails = [];
    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          reject(err);
          return;
        }
        const fetch = imap.seq.fetch('1:10', {
          bodies: '',
          struct: true
        });
        fetch.on('message', (msg) => {
          msg.on('body', (stream) => {
            simpleParser(stream, (err, parsed) => {
              if (err) {
                console.error('Parse error:', err);
                return;
              }
              emails.push({
                from: parsed.from?.text || 'Unknown',
                subject: parsed.subject || 'No Subject',
                date: parsed.date || new Date(),
                text: parsed.text || 'No content',
                html: parsed.html || null,
                type: 'received'
              });
            });
          });
        });
        fetch.once('error', (err) => {
          reject(err);
        });
        fetch.once('end', () => {
          imap.end();
        });
      });
    });
    imap.once('error', (err) => {
      reject(err);
    });
    imap.once('end', () => {
      resolve(emails);
    });
    imap.connect();
  });
}