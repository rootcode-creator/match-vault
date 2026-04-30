import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function getBaseUrl() {
    const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();

    if (configured) {
        if (configured.startsWith('http://') || configured.startsWith('https://')) {
            return configured;
        }

        return `https://${configured}`;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return 'http://localhost:3000';
}

export async function sendVerificationEmail(email: string, token: string) {
    const link = `${getBaseUrl()}/verify-email?token=${token}`;

    return resend.emails.send({
        from: 'verify-email@credentials.kawserahmed.tech',
        to: email,
        subject: 'Verify your email address',
        html: `
            <h1>Verify your email address ${email}</h1>
            <p>Click the link below to verify your email address</p>
            <a href="${link}">Verify email</a>
        `
    })
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const link = `${getBaseUrl()}/reset-password?token=${token}`;

    return resend.emails.send({
        from: 'reset-password@credentials.kawserahmed.tech',
        to: email,
        subject: 'Reset your password',
        html: `
            <h1>You have requested to reset your password for ${email}</h1>
            <p>Click the link below to reset password</p>
            <a href="${link}">Reset password</a>
        `
    })
}

