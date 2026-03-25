"use client";

import { memberEditSchema, MemberEditSchema } from '@/lib/schemas/MemberEditSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Member } from '@prisma/client';
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { Button, Input, Textarea } from '@heroui/react';
import { updateMemberProfile } from '@/app/actions/userActions';
import { toast } from 'react-toastify';
import { handleFormServerErrors } from '@/lib/util';


type Props = {
    member: Member;
}


export default function EditForm({ member, }: Props) {

    const fieldClassNames = {
        base: "w-full",
        // Matches the login screenshot: light border + subtle shadow + compact height
        inputWrapper:
            "bg-white border border-slate-200 rounded-xl shadow-sm h-12 px-4 transition focus-within:border-fuchsia-400 focus-within:ring-2 focus-within:ring-fuchsia-200/60",
        input: "text-neutral-900 placeholder:text-slate-400",
        label: "text-sm font-medium text-neutral-700",
    } as const;

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {
            isValid,
            isDirty,
            isSubmitting,
            errors,
        },
    } = useForm<MemberEditSchema>({
        // resolver: zodResolver(memberEditSchema),
        
        mode: "onTouched",
    });

    const router = useRouter();


    useEffect(() => {


        if (member) {


            reset({


                name: member.name,


                description: member.description,


                city: member.city,


                country: member.country,


            });


        }


    }, [member, reset]);


    const onsubmit = async (data: MemberEditSchema) => {
        const nameUpdated = data.name !== member.name;
        const result = await updateMemberProfile(data, nameUpdated);

        if (result.status === "success") {
            toast.success("Profile updated successfully");
            router.refresh();
            reset({...data});
        
        }else{
          handleFormServerErrors(result, setError);
    }

    };

    return (
        <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col space-y-3"
        >


            <fieldset>
                <legend>Name:</legend>

                <Input
                    type="text"
                    placeholder='Name'
                    variant='bordered'
                    {...register("name")}
                    defaultValue={member.name}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                    classNames={fieldClassNames}
                />
            </fieldset>

            <Textarea
                label='Description:'
                placeholder='Description'
                variant='bordered'
                {...register("description")}
                defaultValue={member.description}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                minRows={5}

            />



            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>



                <fieldset>
                    <legend >City:</legend>
                    <Input
                        placeholder="City:" variant='bordered' {...register("city")}

                        defaultValue={member.city}
                        isInvalid={!!errors.city}
                        errorMessage={errors.city?.message}
                        classNames={fieldClassNames}

                    />

                </fieldset>


                <fieldset>
                    <legend>Country:</legend>
                    <Input
                        placeholder="Country" variant='bordered' {...register("country")}

                        defaultValue={member.country}
                        isInvalid={!!errors.country}
                        errorMessage={errors.country?.message}
                        classNames={fieldClassNames}

                    />

                </fieldset>
            </div>

            {errors.root?.serverError && (

                <p className='text-danger text-sm'>
                    {errors.root.serverError.message}
                </p>
            )}

            <Button
                type='submit'
                variant='solid'
                isDisabled={!isValid || !isDirty}
                isLoading={isSubmitting}
                className="h-12 w-full rounded-xl font-semibold text-white shadow-sm bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:opacity-95 transition-opacity"
            >
                Update profile
            </Button>







        </form>
    );
}
