import nodemailer from 'nodemailer';
import { logger } from '../logger';

// @ts-ignore
const emailLogger = logger.child ? logger.child({ service: 'email-service' }) : logger;

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendInviteEmail(to: string, inviteLink: string, projectName: string) {
        // Mock email sending in development if credentials are invalid or missing
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            emailLogger.info(`[DEV MODE] Mock Email to ${to}:
            Subject: You've been invited to join ${projectName}
            Link: ${inviteLink}
            `);
            return { messageId: 'mock-id-' + Date.now() };
        }

        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"Collaboration App" <no-reply@collab.com>',
                to,
                subject: `You've been invited to join ${projectName}`,
                html: `
                    <h1>Project Invitation</h1>
                    <p>You have been invited to collaborate on the project <strong>${projectName}</strong>.</p>
                    <p>Click the link below to accept the invitation:</p>
                    <a href="${inviteLink}">${inviteLink}</a>
                    <p>This link will expire in 48 hours.</p>
                `,
            });
            emailLogger.info(`Invite email sent to ${to}: ${info.messageId}`);
            return info;
        } catch (error) {
            emailLogger.error('Error sending invite email', error);
            // In dev, don't block if email fails (unless we want strict testing)
            // throwing error here causes the API to return 500
            if (process.env.NODE_ENV === 'development') {
                emailLogger.warn('[DEV MODE] Suppressing email error to allow flow verification');
                return { messageId: 'failed-but-suppressed' };
            }
            throw error;
        }
    }
}
