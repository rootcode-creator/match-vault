"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { GiPadlock } from "react-icons/gi";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { signInUser } from "@/app/actions/authActions";
import type { LoginSchema } from "@/lib/schemas/LoginSchema";
import { toast } from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    // server-side validation only (no Zod on client)
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginSchema) => {
    const result = await signInUser(data);

    if (result.status === "success") {
      router.push("/members");
      router.refresh();
      return;
    }

    // Show a toast and map possible field errors from server
    if (Array.isArray(result.error)) {
      result.error.forEach((e: any, idx: number) => {
        const fieldName = (e?.path?.join?.(".") ?? "root") as
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
      toast.error("Please fix the highlighted fields.");
    } else {
      const msg = String(result.error ?? "Login failed");
      setError("root.serverError", { type: "server", message: msg });
      toast.error(msg);
    }
  };

  // match the Register form input feel
  const inputWrapper =
    "rounded-xl bg-white/90 border border-gray-200 shadow-sm transition-all duration-200 ease-out " +
    "hover:shadow-md focus-within:bg-white focus-within:border-pink-500/70 " +
    "focus-within:ring-2 focus-within:ring-pink-300/60 focus-within:shadow-[0_8px_24px_-8px_rgba(236,72,153,0.35)]";
  const inputBase =
    "text-base placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

  return (
    <Card className="relative w-full max-w-md mx-auto py-10 px-8 rounded-2xl bg-white/95 backdrop-blur
      ring-1 ring-pink-100 border border-white/60
      shadow-[0_18px_50px_-12px_rgba(236,72,153,0.45),0_25px_55px_-25px_rgba(0,0,0,0.35)]">
      <CardHeader className="flex flex-col items-center justify-center mb-6">
        <div className="flex flex-col gap-2 items-center text-default">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Login</h1>
          </div>
          <p className="text-neutral-500">Welcome back to NextMatch</p>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Email */}
            <div className="w-full max-w-sm mx-auto">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                aria-invalid={!!errors.email}
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                aria-invalid={!!errors.password}
                placeholder="Your password"
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
                autoComplete="current-password"
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
                className="mt-2 h-10 rounded-lg bg-[#ffd6ba] text-black font-semibold shadow-md hover:shadow-lg active:translate-y-px focus:outline-none focus-visible:outline-none"
              >
                Login
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}