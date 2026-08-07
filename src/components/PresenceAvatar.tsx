import usePresenceStore from "@/hooks/usePresenceStore";
import React from "react";

type Props = {
  userId?: string;
  src?: string | null;
};

export default function PresenceAvatar({
  userId,
  src,
}: Props) {
  const membersId = usePresenceStore(
    (state) => state.membersId
  );

  const isOnline =
    userId && membersId.indexOf(userId) !== -1;

  return (
    <div className="relative inline-flex h-9 w-9 overflow-hidden rounded-full bg-slate-100">
      <img
        src={src || "/images/user.png"}
        alt="User avatar"
        className="h-full w-full object-cover"
      />
      {isOnline && (
        <span
          className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse"
          aria-label="Online"
        />
      )}
    </div>
  );
}