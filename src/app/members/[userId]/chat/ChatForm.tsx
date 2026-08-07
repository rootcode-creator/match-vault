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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  HiPaperAirplane,
} from "react-icons/hi2";

export default function ChatForm() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isValid, errors },
  } = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    mode: "onChange",
    defaultValues: { text: "" },
  });

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notifyTyping = useCallback(async (typingState: boolean) => {
    if (!params?.userId) return;

    const apiUrl =
      typeof window !== "undefined"
        ? new URL("/api/chat-typing", window.location.origin).href
        : "/api/chat-typing";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientUserId: params.userId,
          isTyping: typingState,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        console.error("Typing status request failed", response.status, body);
      }
    } catch (error) {
      console.error("Failed to send typing status", error);
    }
  }, [params?.userId]);

  const onTyping = useCallback(async () => {
    if (!isTyping) {
      setIsTyping(true);
      await notifyTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false);
      await notifyTyping(false);
    }, 1200);
  }, [isTyping, notifyTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

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
      setIsTyping(false);
      await notifyTyping(false);
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full min-w-0"
    >
      <div className="w-full rounded-[24px] border border-[#cde0ea] bg-[linear-gradient(180deg,#e9f6ff_0%,#d8ecfb_100%)] p-1.5 shadow-[0_8px_24px_rgba(36,91,122,0.12)]">
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              fullWidth
              placeholder="Type new message..."
              variant="flat"
              classNames={{
                base: "w-full",
                inputWrapper:
                  "w-full h-12 rounded-[18px] border border-[#c9dce7] bg-white/95 px-3 shadow-none data-[hover=true]:bg-white group-data-[focus=true]:border-[#9fc2d5] group-data-[focus=true]:bg-white",
                input:
                  "w-full border-0 bg-transparent text-sm font-medium text-[#173042] placeholder:text-[#65869a] outline-none ring-0 focus:outline-none focus:ring-0",
                innerWrapper: "gap-2",
              }}
              endContent={
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!isValid || isSubmitting}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b8cfda] bg-[linear-gradient(180deg,#f2fbff_0%,#deedf5_100%)] text-[#284458] transition hover:bg-[linear-gradient(180deg,#eff9ff_0%,#d5e9f5_100%)] disabled:cursor-not-allowed disabled:border-[#d4e1e8] disabled:text-[#96acb9]"
                >
                  <HiPaperAirplane size={15} className="-rotate-12" />
                </button>
              }
              value={field.value}
              onBlur={field.onBlur}
              onValueChange={(value) => {
                field.onChange(value);
                onTyping();
              }}
              name={field.name}
              isInvalid={!!errors.text}
              errorMessage={errors.text?.message}
            />
          )}
        />
      </div>
      <div className="flex flex-col mt-2">
        {errors.root?.serverError && (
          <p className="text-danger text-sm">
            {errors.root.serverError.message}
          </p>
        )}
      </div>
    </form>
  );
}