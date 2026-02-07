
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testEmail() {
    console.log('Testing email configuration...');
    console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
    console.log(`SMTP Port: ${process.env.SMTP_PORT}`);
    console.log(`SMTP User: ${process.env.SMTP_USER}`);
    console.log(`SMTP Secure: ${process.env.SMTP_SECURE}`);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to self
            subject: 'Test Email from Collab App',
            html: '<h1>Success!</h1><p>Your email service is configured correctly.</p>',
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
}

testEmail();
