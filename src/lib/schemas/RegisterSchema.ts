import { z } from "zod";
import { calculateAge } from "../util";

export const registerSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name is required'
    }).trim().min(3 , {
        message: 'Name must be at least 3 characters'
    }),
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email is required'
    }).trim().email({
        message: 'Please enter a valid email address'
    }),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password is required'
    }).min(6, {
        message: 'Password must be at least 6 characters'
    })
})

export const profileSchema = z.object({
    gender: z.string({
        required_error: 'Gender is required',
        invalid_type_error: 'Gender is required'
    }).min(1, {
        message: 'Gender is required'
    }),
    description: z.string({
        required_error: 'Description is required',
        invalid_type_error: 'Description is required'
    }).trim().min(1, {
        message: 'Description is required'
    }),
    city: z.string({
        required_error: 'City is required',
        invalid_type_error: 'City is required'
    }).trim().min(1, {
        message: 'City is required'
    }),
    country:z.string({
        required_error: 'Country is required',
        invalid_type_error: 'Country is required'
    }).trim().min(1, {
        message: 'Country is required'
    }),
    dateOfBirth: z.string({
        required_error: 'Date of birth is required',
        invalid_type_error: 'Date of birth is required'
    }).min(1, {
        message: 'Date of birth is required'
    }).refine(dateString => {
        const age = calculateAge(new Date(dateString));
        return age >= 18;
    }, {
        message: 'You must be at least 18 years old to use this app'
    
    }),
});

export const combinedRegisterSchema = registerSchema.and(profileSchema);

export type ProfileSchema = z.infer<typeof profileSchema>;
export type RegisterSchema = z.infer<typeof combinedRegisterSchema>;