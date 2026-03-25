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
    <div className="flex justify-center items-start pt-6 pb-8 min-h-[calc(100dvh-80px)] px-4">
      <Card
        className="relative w-full max-w-sm mx-auto py-5 px-5 h-fit rounded-2xl bg-white/95 backdrop-blur
        ring-1 ring-pink-100 border border-white/60
        shadow-[0_14px_38px_-14px_rgba(236,72,153,0.4),0_18px_30px_-20px_rgba(0,0,0,0.3)]"
      >
        <CardHeader className="flex flex-col items-center justify-center mb-1">
          <div className="flex flex-col gap-1.5 items-center text-default text-center">
            <div className="flex flex-row items-center gap-2.5">
              <MdOutlineMailOutline size={24} />
              <h1 className="text-2xl font-semibold leading-tight">Verify your email address</h1>
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-4 pb-2">
          <ResultMessage result={result} />
        </CardBody>
      </Card>
    </div>
  );
}
