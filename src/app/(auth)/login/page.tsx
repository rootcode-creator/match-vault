import React from "react";
import LoginFormClient from "./LoginFormClient";

export default function Login() {
  return (
    <div className="flex h-[calc(100dvh-80px)] items-center justify-center overflow-hidden px-4 sm:px-6">
      <LoginFormClient />
    </div>
  );
}
