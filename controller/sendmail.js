const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const gmail = google.gmail('v1');

// Set up OAuth2 client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID_MAIL;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET_MAIL;

const oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/callback',
);

// Set up credentials
const credentials = {
  access_token: '1//048LOJ9iAQ7pECgYIARAAGAQSNwF-L9IrHCk7bDIm6XQmSfrgFAXtXSg1xwMMmGoon-JkmDg0JT4HO13d3-EfGZ2tsMCG24q4udU',
  refresh_token: 'ya29.a0Ael9sCMePWrktZ8j8bh0DfKdvSTYbqFB-favjAV-6NdDkGf0cf5GmNhtMKXuped8oh9_--E51KzGoh1FLM449MVmVrDOR6FJlvtByYR1H7hz1QGKDRqoMtakHzKwZ-2COL6gvo_g-qgPl3yaM_KAzbZMLu5uaCgYKAe0SARESFQF4udJhUMS1A45jCwg6RR5PVAjFVg0163',
};

oauth2Client.setCredentials(credentials);

// Monitor inbox for new emails
const monitorInbox = (req,res) => {
  gmail.users.messages.list({
    auth: oauth2Client,
    userId: 'me',
    q: 'is:unread',
  }, (err, res) => {
    if (err) {
      console.log('The API returned an error:', err);
      return;
    }
    const messages = res.data.messages;
    if (messages.length) {
      messages.forEach((message) => {
        gmail.users.messages.get({
          auth: oauth2Client,
          userId: 'me',
          id: message.id,
        }, (err, res) => {
          if (err) {
            console.log('The API returned an error:', err);
            return;
          }
          const from = res.data.payload.headers.find((header) => header.name === 'From').value;
          const subject = res.data.payload.headers.find((header) => header.name === 'Subject').value;
          const body = res.data.snippet;
          const reply = `Thank you for your email! I am currently out of the office and will not be able to respond until my return on DATE. Please bear with me until then.`;
          gmail.users.messages.send({
            auth: oauth2Client,
            userId: 'me',
            resource: {
              raw: new Buffer.from(
                `From: "YOUR_VACATION_RESPONDER_EMAIL"\n` +
                `To: ${from}\n` +
                `Subject: RE: ${subject}\n\n` +
                `${reply}`
              ).toString('base64')
            }
          }, (err, res) => {
            if (err) {
              console.log('The API returned an error:', err);
              return;
            }
            console.log('Response sent:', res);
          });
        });
      });
    } else {
      console.log('No new messages');
    }
  });
};

setInterval(monitorInbox, 60000); // Poll inbox every 1 minutes
