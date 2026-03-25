"use client";

import { resetPassword } from "@/app/actions/authActions";
import ResultMessage from "@/components/ResultMessage";
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from "@/lib/schemas/ForgotPasswordSchema";
import { ActionResult } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLock } from "react-icons/fi";
import { GiPadlock } from "react-icons/gi";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [result, setResult] =
    useState<ActionResult<string> | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordSchema>({
    mode: "onTouched",
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (
    data: ResetPasswordSchema
  ) => {
    setResult(
      await resetPassword(
        data.password,
        searchParams.get("token")
      )
    );
    reset();
  };

  const inputWrapper =
    "rounded-xl bg-white/90 border border-gray-200 shadow-sm transition-all duration-200 ease-out " +
    "hover:shadow-md focus-within:bg-white focus-within:border-pink-500/70 " +
    "focus-within:ring-2 focus-within:ring-pink-300/60 focus-within:shadow-[0_8px_24px_-8px_rgba(236,72,153,0.35)]";
  const inputBase =
    "text-base placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

  return (
    <div className="flex items-start justify-center pt-14 pb-10 min-h-[calc(100dvh-80px)]">
      <Card
        className="relative h-fit w-full max-w-md mx-auto py-5 px-6 rounded-2xl bg-white/95 backdrop-blur
        ring-1 ring-pink-100 border border-white/60
        shadow-[0_18px_50px_-12px_rgba(236,72,153,0.45),0_25px_55px_-25px_rgba(0,0,0,0.35)]"
      >
        <CardHeader className="flex flex-col items-center justify-center mb-1">
          <div className="flex flex-col gap-2 items-center text-default">
            <div className="flex flex-row items-center gap-3">
              <GiPadlock size={30} />
              <h1 className="text-2xl font-semibold">Reset password</h1>
            </div>
            <p className="text-neutral-500 text-center text-sm">
              Enter your new password below
            </p>
          </div>
        </CardHeader>

        <CardBody className="pt-5 pb-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="w-full">
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                variant="bordered"
                defaultValue=""
                classNames={{
                  inputWrapper,
                  input: inputBase,
                  innerWrapper: "gap-2",
                  errorMessage: "text-sm text-black",
                }}
                startContent={<FiLock className="text-gray-500" />}
                {...register("password")}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message as string}
              />
            </div>

            <div className="w-full">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                variant="bordered"
                defaultValue=""
                classNames={{
                  inputWrapper,
                  input: inputBase,
                  innerWrapper: "gap-2",
                  errorMessage: "text-sm text-black",
                }}
                startContent={<FiLock className="text-gray-500" />}
                {...register("confirmPassword")}
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message as string}
              />
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              disableRipple
              className="h-9 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg active:translate-y-px"
            >
              Reset password
            </Button>

            <ResultMessage result={result} />
          </form>
        </CardBody>
      </Card>
    </div>
  );
}