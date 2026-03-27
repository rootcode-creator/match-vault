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
  HiOutlineMicrophone,
  HiOutlinePlus,
} from "react-icons/hi2";
import { BsEmojiSmile } from "react-icons/bs";

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
              "h-14 rounded-full border border-black/20 bg-default-50 px-2 shadow-none data-[hover=true]:bg-default-100 group-data-[focus=true]:border-black/25",
            input:
              "text-base text-default-700 placeholder:text-default-500",
            innerWrapper: "gap-2",
          }}
          startContent={
            <div className="flex items-center gap-3 text-default-700 pl-1">
              <button
                type="button"
                aria-label="Add"
                className="inline-flex items-center justify-center"
              >
                <HiOutlinePlus size={20} />
              </button>
              <button
                type="button"
                aria-label="Emoji"
                className="inline-flex items-center justify-center"
              >
                <BsEmojiSmile size={18} />
              </button>
            </div>
          }
          endContent={
            <button
              type="submit"
              aria-label="Send message"
              disabled={!isValid || isSubmitting}
              className="inline-flex items-center justify-center text-default-700 pr-1 disabled:text-default-400"
            >
              <HiOutlineMicrophone size={20} />
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