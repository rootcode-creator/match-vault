import React from "react";

export default function LoadingComponent({
  label,
}: {
  label?: string;
}) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      <p className="text-sm text-default-600">{label || "Loading..."}</p>
    </div>
  );
}