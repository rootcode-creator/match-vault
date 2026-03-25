"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

export default function RegisterSuccessPage() {
  const router = useRouter();

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
              <FaCheckCircle size={30} />
              <h1 className="text-2xl font-semibold">
                You have successfully registered
              </h1>
            </div>
            <p className="text-neutral-500 text-center text-sm">
              You can now login to the app
            </p>
          </div>
        </CardHeader>

        <CardBody className="pt-5 pb-6">
          <Button
            onClick={() => router.push("/login")}
            fullWidth
            disableRipple
            className="h-9 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg active:translate-y-px"
          >
            Go to login
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}