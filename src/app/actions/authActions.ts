'use server';

import {auth, signIn, signOut} from '@/auth';
import {prisma} from '@/lib/prisma';
import { LoginSchema } from '@/lib/schemas/LoginSchema';
import { registerSchema, RegisterSchema } from '@/lib/schemas/RegisterSchema';
import { ActionResult } from '@/types';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

const shouldExposeError =
    process.env.DEBUG_ERRORS === 'true' || process.env.NODE_ENV !== 'production';


export async function signInUser(data: LoginSchema): Promise<ActionResult<string>>{
    try {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect:false
        });
        console.log(result);

        return {status: 'success', data: 'Logged in'}
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
        const validated = registerSchema.safeParse(data);
        
        if (!validated.success) {
            return {status: 'error', error: validated.error.errors}
        }

        const {name, email, password } = validated.data;

        const hashedPassword = await bcrypt.hash(password, 12);

        const existingUser = await prisma.user.findUnique({
            where: {email}
        });

        if(existingUser) return {status: 'error', error: 'User already exists'};

        const user = await prisma.user.create ({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                image: "/images/user.png"
            }
        })

        await prisma.member.create({
            data: {
                userId: user.id,
                name: name ?? "New Member",
                gender: "unspecified",
                dateOfBirth: new Date("1970-01-01"),
                description: "",
                city: "",
                country: "",
                image: "/images/user.png"
            }
        })

        return {status: 'success', data: user}


    }catch(error){
        console.error('registerUser failed', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return{status: 'error', error: shouldExposeError ? message : 'Something went wrong'}
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