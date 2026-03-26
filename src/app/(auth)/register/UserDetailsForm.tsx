"use client";

import { Input } from "@heroui/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";

export default function UserDetailsForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext();

  const inputWrapper =
    "rounded-xl bg-white/90 border-2 border-slate-400 shadow-sm transition-all duration-200 ease-out " +
    "hover:shadow-md focus-within:bg-white focus-within:border-pink-500/70 " +
    "focus-within:ring-2 focus-within:ring-pink-300/60 focus-within:shadow-[0_8px_24px_-8px_rgba(236,72,153,0.35)]";
  const inputBase =
    "text-base placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

  return (
    <div className="space-y-5">
      <div className="w-full">
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Name
        </label>
        <Input
          id="name"
          defaultValue={getValues("name")}
          placeholder="Enter your full name"
          variant="bordered"
          classNames={{
            inputWrapper,
            input: inputBase,
            innerWrapper: "gap-2",
            errorMessage: "text-sm text-black",
          }}
          startContent={<LuUserRound className="text-gray-500" />}
          {...register("name")}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message as string}
        />
      </div>

      <div className="w-full">
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <Input
          id="email"
          defaultValue={getValues("email")}
          placeholder="you@example.com"
          type="email"
          variant="bordered"
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

      <div className="w-full">
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
          Password
        </label>
        <Input
          id="password"
          defaultValue={getValues("password")}
          placeholder="Enter a strong password"
          type={showPassword ? "text" : "password"}
          variant="bordered"
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
              onClick={() => setShowPassword((state) => !state)}
              className="text-gray-500 hover:text-black transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          }
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message as string}
        />
      </div>
    </div>
  );
}