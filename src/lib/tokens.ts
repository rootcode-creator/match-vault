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
        return prisma.token.findFirst({
            where: { token }
        })
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