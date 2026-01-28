import usePresenceStore from "@/hooks/usePresenceStore";
import { Avatar } from "@heroui/react";
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
    <div className="relative inline-flex">
      <Avatar
        src={src || "/images/user.png"}
        alt="User avatar"
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