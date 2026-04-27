"use client";

import { createMessage } from "@/app/actions/messageActions";
import {
  MessageSchema,
  messageSchema,
} from "@/lib/schemas/MessageSchema";
import { handleFormServerErrors } from "@/lib/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import {
  HiPaperAirplane,
} from "react-icons/hi2";

export default function ChatForm() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isValid, errors },
  } = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (
    data: MessageSchema
  ) => {
    const result = await createMessage(
      params.userId,
      data
    );
    if (result.status === "error") {
      handleFormServerErrors(result, setError);
    } else {
      reset();
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full"
    >
      <div className="w-full">
        <Input
          fullWidth
          placeholder="Type a message"
          variant="flat"
          classNames={{
            base: "w-full",
            inputWrapper:
              "h-12 rounded-xl border border-default-200 bg-default-100 px-3 shadow-none data-[hover=true]:bg-default-100 group-data-[focus=true]:border-default-300",
            input:
              "border-0 bg-transparent text-sm text-default-700 placeholder:text-default-500 outline-none ring-0 focus:outline-none focus:ring-0",
            innerWrapper: "gap-2",
          }}
          endContent={
            <button
              type="submit"
              aria-label="Send message"
              disabled={!isValid || isSubmitting}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-black transition hover:bg-black/5 disabled:text-default-400"
            >
              <HiPaperAirplane size={15} className="-rotate-12" />
            </button>
          }
          {...register("text")}
          isInvalid={!!errors.text}
          errorMessage={errors.text?.message}
        />
      </div>
      <div className="flex flex-col">
        {errors.root?.serverError && (
          <p className="text-danger text-sm">
            {errors.root.serverError.message}
          </p>
        )}
      </div>
    </form>
  );
}