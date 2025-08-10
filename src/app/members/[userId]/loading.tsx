"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div aria-label="Loading" role="status" className="flex flex-col items-center">
        <div className="flex items-end gap-1.5">
          <span className="loader-wave-bar h-6 w-1.5 rounded bg-gray-600" style={{ animationDelay: "0s" }} />
          <span className="loader-wave-bar h-6 w-1.5 rounded bg-gray-600" style={{ animationDelay: "0.1s" }} />
          <span className="loader-wave-bar h-6 w-1.5 rounded bg-gray-600" style={{ animationDelay: "0.2s" }} />
          <span className="loader-wave-bar h-6 w-1.5 rounded bg-gray-600" style={{ animationDelay: "0.3s" }} />
          <span className="loader-wave-bar h-6 w-1.5 rounded bg-gray-600" style={{ animationDelay: "0.4s" }} />
        </div>
        <span className="mt-4 text-gray-700 text-sm">Loading…</span>
      </div>
    </div>
  );
}