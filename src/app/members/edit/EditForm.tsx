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
        inputWrapper:
            "w-full rounded-xl bg-white border border-slate-200 shadow-sm px-4 py-3 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200/60",
        input: "w-full text-neutral-900 placeholder:text-slate-400",
        innerWrapper: "gap-2",
        label: "text-sm font-medium text-neutral-700",
        errorMessage: "text-sm text-danger",
    } as const;

    const textareaClassNames = {
        inputWrapper:
            "w-full rounded-xl bg-white border border-slate-200 shadow-sm px-4 py-3 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200/60",
        input: "w-full min-h-[140px] text-neutral-900 placeholder:text-slate-400",
        innerWrapper: "gap-2",
        errorMessage: "text-sm text-danger",
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


            <div className="space-y-5">
                <div className="w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                        Name
                    </label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Name"
                        variant="bordered"
                        {...register("name")}
                        defaultValue={member.name}
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                        classNames={fieldClassNames}
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        placeholder="Description"
                        {...register("description")}
                        defaultValue={member.description}
                        rows={5}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/60"
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>



                <div className="w-full">
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-2">
                        City
                    </label>
                    <Input
                        id="city"
                        placeholder="City"
                        variant='bordered'
                        {...register("city")}
                        defaultValue={member.city}
                        isInvalid={!!errors.city}
                        errorMessage={errors.city?.message}
                        classNames={fieldClassNames}
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-2">
                        Country
                    </label>
                    <Input
                        id="country"
                        placeholder="Country"
                        variant='bordered'
                        {...register("country")}
                        defaultValue={member.country}
                        isInvalid={!!errors.country}
                        errorMessage={errors.country?.message}
                        classNames={fieldClassNames}
                    />
                </div>
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
                className="h-12 w-full rounded-xl font-semibold text-white shadow-sm bg-gradient-to-r from-indigo-600 via-violet-600 to-slate-700 hover:opacity-95 transition-opacity"
            >
                Update profile
            </Button>







        </form>
    );
}
