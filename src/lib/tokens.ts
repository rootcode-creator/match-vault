import { TokenType } from '@prisma/client';
import { prisma } from './prisma';

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export async function getTokenByEmail(email: string) {
    try {
        const normalized = normalizeEmail(email);
        return prisma.token.findFirst({
            where: { email: normalized }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTokenByToken(token: string) {
    try {
        // Try exact match first
        let found = await prisma.token.findFirst({ where: { token } });
        if (found) return found;

        // Try decoded token (in case the token was URL-encoded in the link)
        try {
            const decoded = decodeURIComponent(token);
            if (decoded !== token) {
                found = await prisma.token.findFirst({ where: { token: decoded } });
                if (found) return found;
            }
        } catch (e) {
            // ignore decode errors
            console.warn('getTokenByToken: decodeURIComponent failed', e);
        }

        // Fallback: if the provided token looks truncated, try a startsWith search
        // only if it's reasonably long to avoid wide scans.
        if (token && token.length >= 12) {
            found = await prisma.token.findFirst({
                where: { token: { startsWith: token } },
                orderBy: { expires: 'desc' }
            });
            if (found) {
                console.warn('getTokenByToken: token lookup fell back to startsWith match');
                return found;
            }
        }

        return null;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function generateToken(email: string, type: TokenType) {
    const normalizedEmail = normalizeEmail(email);
    const token = getToken();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); //  Expires in 24 hours

    const existingToken = await getTokenByEmail(normalizedEmail);

    if (existingToken) {
        await prisma.token.delete({
            where: { id: existingToken.id }
        })
    }

    return prisma.token.create({
        data: {
            email: normalizedEmail,
            token,
            expires,
            type
        }
    })
}

export async function deleteTokenById(id: string) {
    try {
        return prisma.token.delete({
            where: { id }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function getToken() {
    const arrayBuffer = new Uint8Array(48);
    crypto.getRandomValues(arrayBuffer);
    return Array.from(arrayBuffer, byte => byte.toString(16).padStart(2, '0')).join('');
}