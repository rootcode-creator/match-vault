"use client";

import {
  RegisterSchema,
  registerSchema,
} from "@/lib/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
} from "@heroui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import { registerUser } from "@/app/actions/authActions";

export default function RegisterForm() {
  const {
    register,
    handleSubmit, setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterSchema>({
    // resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterSchema) => {
    const result = await registerUser(data);

    if (result.status === "success") {
      console.log ("User registered successfully");
    }else{
      if (Array.isArray(result.error)) {
        result.error.forEach((e:any) => {
          console.log("e:: ", e);
          const fieldName = e.path.join(".") as
          | "email"
          | "name"
          | "password"
         setError(fieldName, {
          message: e.message,
         });
        });
      }else{
        setError("root.serverError", { 
            message: result.error,
        });

        
      }
    }
    
  };

  return (
    <Card className="w-full max-w-md mx-auto py-10 px-8 rounded-2xl shadow-lg">
      <CardHeader className="flex flex-col items-center justify-center mb-6">
        <div className="flex flex-col gap-2 items-center text-default">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">
              Register
            </h1>
          </div>
          <p className="text-neutral-500">
            Welcome to NextMatch
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
           
            <Input
              defaultValue=""
              label="Name"
              variant="bordered"
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <Input
              defaultValue=""
              label="Email"
              variant="bordered"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              defaultValue=""
              label="Password"
              variant="bordered"
              type="password"
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={
                errors.password?.message
              }
            />

             {(
              // Show server error like "User already exists"
              (errors as any)?.root?.serverError?.message
            ) && (
              <p role="alert" className="text-sm text-red-500">
                {(errors as any).root.serverError.message}
              </p>
            )}
            <Button
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              disableRipple
              color="default"
              type="submit"
              className="mt-2 h-10 bg-[#e5e7eb] text-black font-medium rounded-lg"
            >
              Register
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}