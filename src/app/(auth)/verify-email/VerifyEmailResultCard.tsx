"use client";

import ResultMessage from "@/components/ResultMessage";
import { ActionResult } from "@/types";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { MdOutlineMailOutline } from "react-icons/md";

type Props = {
  result: ActionResult<string>;
};

export default function VerifyEmailResultCard({ result }: Props) {
  return (
    <div className="flex justify-center pt-8 pb-10 min-h-[calc(100dvh-80px)]">
      <Card
        className="relative w-full max-w-md mx-auto py-7 px-6 rounded-2xl bg-white/95 backdrop-blur
        ring-1 ring-pink-100 border border-white/60
        shadow-[0_18px_50px_-12px_rgba(236,72,153,0.45),0_25px_55px_-25px_rgba(0,0,0,0.35)]"
      >
        <CardHeader className="flex flex-col items-center justify-center mb-2">
          <div className="flex flex-col gap-2 items-center text-default">
            <div className="flex flex-row items-center gap-3">
              <MdOutlineMailOutline size={30} />
              <h1 className="text-3xl font-semibold">Verify your email address</h1>
            </div>
            <p className="text-neutral-500">Welcome to NextMatch</p>
          </div>
        </CardHeader>

        <CardBody>
          <ResultMessage result={result} />
        </CardBody>
      </Card>
    </div>
  );
}
