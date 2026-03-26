"use client";

import {
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { format, subYears } from "date-fns";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function ProfileDetailsForm() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  if (!isMounted) return null;

  const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const inputWrapper =
    "rounded-xl bg-white/90 border-2 border-slate-400 shadow-sm transition-all duration-200 ease-out " +
    "hover:shadow-md focus-within:bg-white focus-within:border-pink-500/70 " +
    "focus-within:ring-2 focus-within:ring-pink-300/60 focus-within:shadow-[0_8px_24px_-8px_rgba(236,72,153,0.35)]";
  const inputBase =
    "text-base placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="w-full">
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-foreground mb-0.5"
        >
          Gender
        </label>
        <Controller
          name="gender"
          control={control}
          defaultValue={getValues("gender") || ""}
          render={({ field }) => (
            <Select
              id="gender"
              aria-label="Select gender"
              placeholder="Select gender"
              variant="bordered"
              selectedKeys={field.value ? new Set([field.value]) : new Set([])}
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  field.onChange("");
                  return;
                }
                const selected = Array.from(keys)[0]?.toString() ?? "";
                field.onChange(selected);
              }}
              onBlur={field.onBlur}
              isInvalid={!!errors.gender}
              errorMessage={errors.gender?.message as string}
              popoverProps={{
                classNames: {
                  content: "bg-white border border-gray-200 rounded-xl shadow-lg",
                },
              }}
              listboxProps={{
                className: "bg-white",
              }}
              classNames={{
                trigger: `${inputWrapper} pr-10`,
                value: `${inputBase} pr-4`,
                selectorIcon: "text-gray-500 right-3",
                errorMessage: "text-sm text-black",
              }}
            >
              {genderList.map((item) => (
                <SelectItem key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      <div className="w-full">
        <label
          htmlFor="dateOfBirth"
          className="block text-sm font-medium text-foreground mb-0.5"
        >
          Date of birth
        </label>
        <Input
          id="dateOfBirth"
          defaultValue={getValues("dateOfBirth")}
          max={format(subYears(new Date(), 18), "yyyy-MM-dd")}
          type="date"
          variant="bordered"
          classNames={{
            inputWrapper,
            input: inputBase,
            innerWrapper: "gap-2",
            errorMessage: "text-sm text-black",
          }}
          {...register("dateOfBirth")}
          isInvalid={!!errors.dateOfBirth}
          errorMessage={errors.dateOfBirth?.message as string}
        />
      </div>
      </div>

      <div className="w-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground mb-0.5"
        >
          Description
        </label>
        <Textarea
          id="description"
          defaultValue={getValues("description")}
          minRows={3}
          maxRows={5}
          variant="bordered"
          classNames={{
            inputWrapper: `${inputWrapper} overflow-hidden`,
            input: `${inputBase} whitespace-pre-wrap break-all [overflow-wrap:anywhere]`,
            innerWrapper: "overflow-hidden",
            errorMessage: "text-sm text-black",
          }}
          {...register("description")}
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="w-full">
        <label
          htmlFor="city"
          className="block text-sm font-medium text-foreground mb-0.5"
        >
          City
        </label>
        <Input
          id="city"
          defaultValue={getValues("city")}
          variant="bordered"
          classNames={{
            inputWrapper,
            input: inputBase,
            innerWrapper: "gap-2",
            errorMessage: "text-sm text-black",
          }}
          {...register("city")}
          isInvalid={!!errors.city}
          errorMessage={errors.city?.message as string}
        />
      </div>

      <div className="w-full">
        <label
          htmlFor="country"
          className="block text-sm font-medium text-foreground mb-0.5"
        >
          Country
        </label>
        <Input
          id="country"
          defaultValue={getValues("country")}
          variant="bordered"
          classNames={{
            inputWrapper,
            input: inputBase,
            innerWrapper: "gap-2",
            errorMessage: "text-sm text-black",
          }}
          {...register("country")}
          isInvalid={!!errors.country}
          errorMessage={errors.country?.message as string}
        />
      </div>
      </div>
    </div>
  );
}