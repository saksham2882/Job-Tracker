import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: '"JobTracker Support" <no-reply@jobtracker.com>',
            to,
            subject,
            html,
        };
        const response = await transporter.sendMail(mailOptions);
        return response;
    } catch (err) {
        throw new Error(`Failed to send email: ${err.message || 'Unknown error'}`);
    }
};