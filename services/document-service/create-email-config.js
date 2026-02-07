const nodemailer = require('nodemailer');
const fs = require('fs');

nodemailer.createTestAccount().then(account => {
    const envContent = `# Ethereal Email Test Account
# View sent emails at: https://ethereal.email/login
# Login with the credentials below

SMTP_HOST=${account.smtp.host}
SMTP_PORT=${account.smtp.port}
SMTP_USER=${account.user}
SMTP_PASS=${account.pass}
SMTP_SECURE=false
SMTP_FROM="Collab App" <${account.user}>
FRONTEND_URL=http://localhost:3000
`;
    
    fs.writeFileSync('.env', envContent);
    console.log('Created .env file with Ethereal credentials');
    console.log('');
    console.log('=== ETHEREAL LOGIN INFO ===');
    console.log('URL: https://ethereal.email/login');
    console.log('Email:', account.user);
    console.log('Password:', account.pass);
    console.log('===========================');
}).catch(err => {
    console.error('Error creating test account:', err.message);
});
