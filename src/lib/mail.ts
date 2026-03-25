import { Resend } from 'resend';
const rawAppUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

function getAppUrl() {
    const withProtocol = /^https?:\/\//i.test(rawAppUrl)
        ? rawAppUrl
        : `https://${rawAppUrl}`;
    return withProtocol.replace(/\/$/, '');
}

function getResendClient() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error('Missing RESEND_API_KEY environment variable');
    }

    return new Resend(apiKey);
}

export async function sendVerificationEmail(email: string, token: string) {
    const link = new URL(`/verify-email?token=${encodeURIComponent(token)}`, getAppUrl()).toString();
    const resend = getResendClient();

    return resend.emails.send({
        from: 'verify@credentials.kawserahmed.tech',
        to: email,
        subject: 'Verify your email address',
        html: `
            <h1>Verify your email address</h1>
            <p>Click the link below to verify your email address</p>
            <a href="${link}">Verify email</a>
        `
    })
}


export async function sendPasswordResetEmail(email: string, token: string) {
    const link = new URL(`/reset-password?token=${encodeURIComponent(token)}`, getAppUrl()).toString();
    const resend = getResendClient();

    return resend.emails.send({
        from: 'password-reset@credentials.kawserahmed.tech',
        to: email,
        subject: 'Reset your password',
        html: `
            <h1>You have requested to reset your password</h1>
            <p>Click the link below to reset password</p>
            <a href="${link}">Reset password</a>
        `
    })
}