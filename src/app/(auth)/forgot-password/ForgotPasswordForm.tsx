"use client";

import { generateResetPasswordEmail } from "@/app/actions/authActions";
import ResultMessage from "@/components/ResultMessage";
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from "@/lib/schemas/ForgotPasswordSchema";
import { ActionResult } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail } from "react-icons/fi";
import { GiPadlock } from "react-icons/gi";

export default function ForgotPasswordForm() {
  const [result, setResult] =
    useState<ActionResult<string> | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordSchema>({
    mode: "onTouched",
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (
    data: ForgotPasswordSchema
  ) => {
    setResult(await generateResetPasswordEmail(data.email));
    reset();
  };

  const inputWrapper =
    "rounded-xl bg-white/90 border border-gray-200 shadow-sm transition-all duration-200 ease-out " +
    "hover:shadow-md focus-within:bg-white focus-within:border-indigo-500/70 " +
    "focus-within:ring-2 focus-within:ring-indigo-300/60 focus-within:shadow-[0_8px_24px_-8px_rgba(79,70,229,0.35)]";
  const inputBase =
    "text-base placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

  return (
    <div className="flex items-start justify-center px-4 pt-14 pb-10 min-h-[calc(100dvh-80px)] sm:px-6">
      <Card
        className="relative h-fit w-full max-w-md mx-auto py-5 px-6 rounded-2xl bg-white/95 backdrop-blur
        ring-1 ring-indigo-100 border border-white/60
        shadow-[0_18px_50px_-12px_rgba(79,70,229,0.35),0_25px_55px_-25px_rgba(0,0,0,0.3)]"
      >
        <CardHeader className="flex flex-col items-center justify-center mb-1">
          <div className="flex flex-col gap-2 items-center text-default">
            <div className="flex flex-row items-center gap-3">
              <GiPadlock size={30} />
              <h1 className="text-2xl font-semibold">Forgot password</h1>
            </div>
            <p className="text-neutral-500 text-center text-sm">
              Enter your email to receive a reset link
            </p>
          </div>
        </CardHeader>

        <CardBody className="pt-5 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                variant="bordered"
                defaultValue=""
                classNames={{
                  inputWrapper,
                  input: inputBase,
                  innerWrapper: "gap-2",
                  errorMessage: "text-sm text-black",
                }}
                startContent={<FiMail className="text-gray-500" />}
                {...register("email")}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message as string}
              />
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              disableRipple
              className="h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md hover:shadow-lg active:translate-y-px"
            >
              Send reset link
            </Button>

            <ResultMessage result={result} />
          </form>
        </CardBody>
      </Card>
    </div>
  );
}