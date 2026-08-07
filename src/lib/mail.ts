import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient() {
    const apiKey = process.env.RESEND_API_KEY?.trim();

    if (!apiKey) {
        throw new Error('Missing RESEND_API_KEY. Set it before sending email.');
    }

    if (!resend) {
        resend = new Resend(apiKey);
    }

    return resend;
}

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

function getMailDomain() {
    const configured = process.env.mail_domain?.trim() || process.env.MAIL_DOMAIN?.trim() || process.env.NEXT_PUBLIC_MAIL_DOMAIN?.trim();

    if (!configured) {
        throw new Error('Missing mail domain. Set mail_domain in your environment.');
    }

    return configured;
}

function getFromAddress(localPart: string) {
    return `${localPart}@${getMailDomain()}`;
}

export async function sendVerificationEmail(email: string, token: string) {
    const link = `${getBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;

    return getResendClient().emails.send({
        from: getFromAddress('verify-email'),
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
    const link = `${getBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;

    return getResendClient().emails.send({
        from: getFromAddress('reset-password'),
        to: email,
        subject: 'Reset your password',
        html: `
            <h1>You have requested to reset your password for ${email}</h1>
            <p>Click the link below to reset password</p>
            <a href="${link}">Reset password</a>
        `
    })
}



export async function sendScheduledMeetingEmail(email: string, meetingDescription: string, callId: string) {
    const link = `${getBaseUrl()}/videoCall/facetime/${callId}`;

    return getResendClient().emails.send({
        from: getFromAddress('scheduled-meeting'),
        to: email,
        subject: `Scheduled FaceTime: ${meetingDescription}`,
        html: `
            <h1>You have scheduled a FaceTime meeting</h1>
            <p><strong>Meeting:</strong> ${meetingDescription}</p>
            <p>Click the link below to join the meeting</p>
            <a href="${link}">Join FaceTime Meeting</a>
        `
    })
}