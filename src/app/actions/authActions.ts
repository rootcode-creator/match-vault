'use server';

import {auth, signIn, signOut} from '@/auth';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail';
import {prisma} from '@/lib/prisma';
import { LoginSchema } from '@/lib/schemas/LoginSchema';
import { combinedRegisterSchema, ProfileSchema, registerSchema, RegisterSchema } from '@/lib/schemas/RegisterSchema';
import { deleteTokenById, generateToken, getTokenByToken } from '@/lib/tokens';
import { ActionResult } from '@/types';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

const shouldExposeError =
    process.env.DEBUG_ERRORS === 'true' || process.env.NODE_ENV !== 'production';


export async function signInUser(data: LoginSchema): Promise<ActionResult<string>>{
    try {
        const existingUser = await getUserByEmail(data.email);

        if (!existingUser || !existingUser.email) return { status: 'error', error: 'Invalid credentials' }

        if (!existingUser.emailVerified) {
            const { token, email } = await generateToken(existingUser.email, 'VERIFICATION');

            await sendVerificationEmail(email, token)

            return { status: 'error', error: 'Please verify your email before logging in' }
        }

        await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });

        return { status: 'success', data: 'Logged in' }
    } catch (error) {
        console.error('signInUser failed', error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {status: 'error', error: 'Invalid credentials'}
                    
                default:
                    return {
                        status: 'error',
                        error: shouldExposeError ? error.message : 'Something went wrong'
                    }
            }
            
        }else{
            const message = error instanceof Error ? error.message : 'Unknown error';
            return {status: 'error', error: shouldExposeError ? message : 'Something else went wrong'}

        }
        
    }
}

export async function registerUser(data:RegisterSchema): Promise<ActionResult<User>>{
    try{
        const validated = combinedRegisterSchema.safeParse(data);
        
        if (!validated.success) {
            return {status: 'error', error: validated.error.issues}
        }

        const {name, email, password, gender, description,city, country,dateOfBirth } = validated.data;

        const hashedPassword = await bcrypt.hash(password, 12);

        const existingUser = await prisma.user.findUnique({
            where: {email}
        });

        if (existingUser) {
            return {
                status: 'error',
                error: [
                    {
                        code: 'custom',
                        message: 'Email is already registered',
                        path: ['email']
                    }
                ]
            };
        }

       const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                member: {
                    create: {
                        name,
                        description,
                        city,
                        country,
                        dateOfBirth: new Date(dateOfBirth),
                        gender
                    }
                }
            }
        })

        const verificationToken = await generateToken(email, 'VERIFICATION');        
        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        
        return {status: 'success', data: user}


    }catch(error){
        console.error( error);
        return{status: 'error', error: 'Something went wrong'}
    }
}


export async function signOutUser(){
    await signOut({redirectTo: '/'});
}



export async function getUserByEmail(email: string){
    return prisma.user.findUnique({where: {email}});
}


export async function getAuthUserId(){
    const session = await auth();
    const userId =  session?.user?.id;
    
    if (!userId) throw new Error("Unauthorized");
    return userId;
}


export async function verifyEmail(token: string | null | undefined): Promise<ActionResult<string>> {
    try {
        if (!token) {
            return { status: 'error', error: 'Missing token' }
        }

        const existingToken = await getTokenByToken(token);

        if (!existingToken) {
            return { status: 'error', error: 'Invalid token' }
        }

        if (existingToken.type !== 'VERIFICATION') {
            return { status: 'error', error: 'Invalid token type' }
        }

        const hasExpired = new Date() > existingToken.expires;

        if (hasExpired) {
            return { status: 'error', error: 'Token has expired' }
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            return { status: 'error', error: 'User not found' }
        }

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() }
        });

        await deleteTokenById(existingToken.id)

        return { status: 'success', data: 'Success' }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function generateResetPasswordEmail(email: string): Promise<ActionResult<string>> {
    try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return { status: 'error', error: 'Email not found' }
        }

        const token = await generateToken(email, 'PASSWORD_RESET');

        await sendPasswordResetEmail(token.email, token.token);

        return { status: 'success', data: 'Password reset email has been sent.  Please check your emails' }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}


export async function resetPassword(password: string, token: string | null): Promise<ActionResult<string>> {
    try {
        if (!token) return { status: 'error', error: 'Missing token' };

        const existingToken = await getTokenByToken(token);

        if (!existingToken) {
            return { status: 'error', error: 'Invalid token' }
        }

        if (existingToken.type !== 'PASSWORD_RESET') {
            return { status: 'error', error: 'Invalid token type' }
        }

        const hasExpired = new Date() > existingToken.expires;

        if (hasExpired) {
            return { status: 'error', error: 'Token has expired' }
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            return { status: 'error', error: 'User not found' }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { passwordHash: hashedPassword }
        });

        await deleteTokenById(existingToken.id);

        return { status: 'success', data: 'Password updated successfully.  Please try logging in' }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}

export async function completeSocialLoginProfile(data: ProfileSchema):
    Promise<ActionResult<string>> {

    const session = await auth();

    if (!session?.user) return { status: 'error', error: 'User not found' };

    try {
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                profileComplete: true,
                member: {
                    upsert: {
                        update: {
                            name: session.user.name as string,
                            image: session.user.image,
                            gender: data.gender,
                            dateOfBirth: new Date(data.dateOfBirth),
                            description: data.description,
                            city: data.city,
                            country: data.country
                        },
                        create: {
                            name: session.user.name as string,
                            image: session.user.image,
                            gender: data.gender,
                            dateOfBirth: new Date(data.dateOfBirth),
                            description: data.description,
                            city: data.city,
                            country: data.country
                        }
                    }
                }
            },
            select: {
                accounts: {
                    select: {
                        provider: true
                    }
                }
            }
        })

        const provider = user.accounts[0]?.provider;

        if (!provider) {
            return {
                status: 'error',
                error: 'No linked social provider found. Please sign in again with Google or GitHub.'
            }
        }

        return { status: 'success', data: provider }
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function getUserRole() {
    const session = await auth();

    const role = session?.user.role;

    if (!role) throw new Error('Not in role');

    return role;
}