"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          // RTL + "info" styling
          style: {
            direction: "rtl",
            background: "#EFF6FF", // blue-50
            color: "#1E40AF",      // blue-800
            border: "1px solid #93C5FD", // blue-300
            borderRadius: "12px",
            boxShadow: "0 12px 28px -12px rgba(37,99,235,0.35)",
            padding: "10px 12px",
            fontWeight: 500,
          },
          iconTheme: {
            primary: "#3B82F6",  // blue-500
            secondary: "#E0F2FE" // sky-100
          },
          ariaProps: {
            role: "status",
            "aria-live": "polite",
          },
        }}
      />
    </>
  );
}
