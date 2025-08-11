"use client";
import React, { useEffect, useRef } from "react";
import { memberEditSchema, MemberEditSchema } from "@/lib/schemas/MemberEditSchema";
import { Member } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "@heroui/react";
import { updateMemberProfile } from "@/app/actions/userActions";
import { toast } from "react-toastify";
import { handleFormServerErrors } from "@/lib/util";
import { useRouter } from "next/navigation";

type Props = {
  member: Member;
};

// Reusable input styles
const inputWrapper =
  "rounded-xl bg-white/90 border border-gray-200 shadow-sm transition-all duration-200 ease-out " +
  "hover:shadow-md focus-within:bg-white focus-within:border-pink-500/70 " +
  "focus-within:ring-2 focus-within:ring-pink-300/60";
const inputBase =
  "text-base placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

// Native auto-resize textarea (prevents overlap/clipping)
function AutoResizeTextarea({
  value,
  className,
  onChange,
  onBlur,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value as any}
      onChange={(e) => {
        onChange?.(e);
        // grow while typing
        requestAnimationFrame(resize);
      }}
      onBlur={onBlur}
      className={
        "w-full rounded-xl border border-gray-200 bg-white/90 shadow-sm " +
        "px-3 py-3 text-base leading-relaxed placeholder:text-gray-400 " +
        "outline-none focus:outline-none focus:ring-2 focus:ring-pink-300/60 focus:border-pink-500/70 " +
        "whitespace-pre-wrap break-words resize-none min-h-[120px] " +
        (className ?? "")
      }
      {...props}
    />
  );
}

export default function EditForm({ member }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { isValid, isDirty, isSubmitting, errors },
  } = useForm<MemberEditSchema>({
    resolver: zodResolver(memberEditSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

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

  const onSubmit = async (data: MemberEditSchema) => {
    const nameUpdated = data.name !== member.name;
    const result = await updateMemberProfile(data, nameUpdated);

    if (result.status === "success") {
      toast.success("Profile updated");
      router.refresh();
      reset({ ...data });
    } else {
      handleFormServerErrors(result, setError);
    }
  };

  const isSubmitDisabled = isSubmitting || !isDirty || !isValid;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <Input
          id="name"
          placeholder="Enter your full name"
          variant="bordered"
          size="md"
          classNames={{ inputWrapper, input: inputBase }}
          {...register("name")}
          isInvalid={!!errors?.name}
        />
        {errors?.name?.message && (
          <p className="mt-1 text-sm text-black">{errors.name.message as string}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <AutoResizeTextarea
              id="description"
              placeholder="Tell others about yourself..."
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={!!errors?.description}
            />
          )}
        />
        {errors?.description?.message && (
          <p className="mt-1 text-sm text-black">{errors.description.message as string}</p>
        )}
      </div>

      {/* City / Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City
          </label>
          <Input
            id="city"
            placeholder="Your city"
            variant="bordered"
            size="md"
            classNames={{ inputWrapper, input: inputBase }}
            {...register("city")}
            isInvalid={!!errors?.city}
          />
          {errors?.city?.message && (
            <p className="mt-1 text-sm text-black">{errors.city.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            Country
          </label>
          <Input
            id="country"
            placeholder="Your country"
            variant="bordered"
            size="md"
            classNames={{ inputWrapper, input: inputBase }}
            {...register("country")}
            isInvalid={!!errors?.country}
          />
          {errors?.country?.message && (
            <p className="mt-1 text-sm text-black">{errors.country.message as string}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          color="default"
          disableRipple
          className="h-10 rounded-lg bg-[#d4aa59] text-black font-semibold shadow-md hover:shadow-lg active:translate-y-px
                     transition-colors
                     disabled:bg-[#e5e7eb] disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed
                     aria-[disabled=true]:bg-[#e5e7eb] aria-[disabled=true]:text-gray-500 aria-[disabled=true]:shadow-none
                     data-[disabled=true]:bg-[#e5e7eb] data-[disabled=true]:text-gray-500 data-[disabled=true]:shadow-none"
          isDisabled={isSubmitDisabled}
          aria-disabled={isSubmitDisabled}
        >
          Update profile
        </Button>
      </div>
    </form>
  );
}