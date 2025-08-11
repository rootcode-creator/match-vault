"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { GiPadlock } from "react-icons/gi";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { registerUser } from "@/app/actions/authActions";
import type { RegisterSchema } from "@/lib/schemas/RegisterSchema";
import { toast } from "react-hot-toast";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    // server-side validation only
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterSchema) => {
    const result = await registerUser(data);

    if (result.status === "success") {
      toast.success("Registration successful");
      // optionally route after success
      // router.push("/login");
      return;
    }

    if (Array.isArray(result.error)) {
      result.error.forEach((e: any, idx: number) => {
        const fieldName = (e?.path?.join?.(".") ?? "root") as
          | "name"
          | "email"
          | "password"
          | "root";
        if (fieldName === "root") {
          setError("root.serverError", { type: "server", message: e.message });
        } else {
          setError(
            fieldName,
            { type: "server", message: e.message },
            { shouldFocus: idx === 0 }
          );
        }
      });
    } else {
      setError("root.serverError", {
        type: "server",
        message: String(result.error ?? "Registration failed"),
      });
    }
  };

  // match Login form input feel
  const inputWrapper =
    "rounded-xl bg-white/90 border border-gray-200 shadow-sm transition-all duration-200 ease-out " +
    "hover:shadow-md focus-within:bg-white focus-within:border-pink-500/70 " +
    "focus-within:ring-2 focus-within:ring-pink-300/60 focus-within:shadow-[0_8px_24px_-8px_rgba(236,72,153,0.35)]";
  const inputBase =
    "text-base placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

  return (
    <Card
      className="relative w-full max-w-md mx-auto py-10 px-8 rounded-2xl bg-white/95 backdrop-blur
      ring-1 ring-pink-100 border border-white/60
      shadow-[0_18px_50px_-12px_rgba(236,72,153,0.45),0_25px_55px_-25px_rgba(0,0,0,0.35)]"
    >
      <CardHeader className="flex flex-col items-center justify-center mb-6">
        <div className="flex flex-col gap-2 items-center text-default">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>
          <p className="text-neutral-500">Welcome to NextMatch</p>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Name */}
            <div className="w-full max-w-sm mx-auto">
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Name
              </label>
              <Input
                id="name"
                placeholder="Enter your full name"
                variant="bordered"
                size="md"
                isInvalid={!!errors.name}
                classNames={{
                  inputWrapper,
                  input: inputBase,
                  innerWrapper: "gap-2",
                  errorMessage: "text-sm text-black",
                }}
                startContent={<FiUser className="text-gray-500" />}
                autoComplete="name"
                {...register("name")}
              />
              {errors.name?.message && (
                <p role="alert" className="mt-1 text-sm text-black">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="w-full max-w-sm mx-auto">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                variant="bordered"
                size="md"
                isInvalid={!!errors.email}
                classNames={{
                  inputWrapper,
                  input: inputBase,
                  innerWrapper: "gap-2",
                  errorMessage: "text-sm text-black",
                }}
                startContent={<FiMail className="text-gray-500" />}
                autoComplete="email"
                {...register("email")}
              />
              {errors.email?.message && (
                <p role="alert" className="mt-1 text-sm text-black">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="w-full max-w-sm mx-auto">
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter a strong password"
                variant="bordered"
                size="md"
                isInvalid={!!errors.password}
                classNames={{
                  inputWrapper,
                  input: inputBase,
                  innerWrapper: "gap-2",
                  errorMessage: "text-sm text-black",
                }}
                startContent={<FiLock className="text-gray-500" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-gray-500 hover:text-black transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password?.message && (
                <p role="alert" className="mt-1 text-sm text-black">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            {/* Non-field server error */}
            {(errors as any)?.root?.serverError?.message && (
              <p role="alert" className="w-full max-w-sm mx-auto text-sm text-black">
                {(errors as any).root.serverError.message}
              </p>
            )}

            <div className="w-full max-w-sm mx-auto">
              <Button
                isDisabled={isSubmitting}
                fullWidth
                disableRipple
                color="default"
                type="submit"
                className="mt-2 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg active:translate-y-px focus:outline-none focus-visible:outline-none"
              >
                Register
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}